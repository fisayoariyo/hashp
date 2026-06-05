import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { LANDING_CONTACT } from "../../pages/landing/landingContent";
import { getDisplayError } from "../../utils/apiErrors";
import {
  extractGeoArray,
  getGeoLgas,
  getGeoStates,
  mapGeoLgaOption,
  mapGeoStateOption,
  submitFarmerInterest,
} from "../../services/cropexApi";

const INITIAL_FORM = {
  fullName: "",
  location: "",
  localGovt: "",
  phone: "",
  email: "",
};

export function StartJourneySuccessModal({ open, onClose }) {
  const { successModal } = LANDING_CONTACT;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-journey-success-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-landing-black/50"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-[420px] rounded-[20px] bg-white px-6 py-7 shadow-[0_24px_48px_rgba(3,15,15,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-landing-green/70 transition-colors hover:text-landing-green"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3
          id="start-journey-success-title"
          className="pr-8 font-display text-[1.5rem] font-bold leading-tight text-landing-green"
        >
          {successModal.title}
        </h3>
        <p className="mt-3 font-sans text-[15px] leading-[1.55] text-landing-black/80 desktop:text-[16px]">
          {successModal.message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="landing-primary-button mt-6 h-[52px] w-full rounded-[15px] text-[17px] desktop:h-auto desktop:text-[18px]"
        >
          {successModal.buttonLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default function StartJourneyLeadForm({
  idPrefix = "start-journey",
  className = "space-y-[22px]",
  wrapperClassName = "",
  submitVariant = "inline-half",
  showAlreadyHaveAccount = false,
  footerClassName = "",
  submitButtonClassName = "",
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [stateOptions, setStateOptions] = useState([]);
  const [lgaOptions, setLgaOptions] = useState([]);
  const [lgasLoading, setLgasLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const formId = `${idPrefix}-form`;

  useEffect(() => {
    let active = true;
    getGeoStates()
      .then((payload) => {
        if (!active) return;
        setStateOptions(extractGeoArray(payload).map(mapGeoStateOption).filter(Boolean));
      })
      .catch(() => {
        if (active) setStateOptions([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!form.location) {
      setLgaOptions([]);
      setLgasLoading(false);
      return undefined;
    }

    let active = true;
    setLgasLoading(true);
    getGeoLgas(form.location)
      .then((payload) => {
        if (!active) return;
        setLgaOptions(extractGeoArray(payload).map(mapGeoLgaOption).filter(Boolean));
      })
      .catch(() => {
        if (active) setLgaOptions([]);
      })
      .finally(() => {
        if (active) setLgasLoading(false);
      });

    return () => {
      active = false;
    };
  }, [form.location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitError("");
    setFieldErrors((current) => {
      if (name === "location" && current.location) {
        return { ...current, location: "" };
      }
      if (name === "phone" && current.phone) {
        return { ...current, phone: "" };
      }
      return current;
    });
    setForm((current) => {
      if (name === "location") {
        return {
          ...current,
          location: value,
          localGovt: "",
        };
      }
      return { ...current, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const selectedState = stateOptions.find((option) => String(option.id) === String(form.location));
      const locationLabel = [
        selectedState?.name || form.location,
        form.localGovt,
      ]
        .filter(Boolean)
        .join(" - ");

      await submitFarmerInterest({
        fullName: form.fullName,
        location: locationLabel || selectedState?.name || form.location,
        phone: form.phone,
        email: form.email,
      });
      setForm(INITIAL_FORM);
      setFieldErrors({});
      setShowSuccess(true);
    } catch (error) {
      const fieldLevel = parseFieldErrors(error);
      if (Object.keys(fieldLevel).length) {
        setFieldErrors(fieldLevel);
      } else {
        setSubmitError(getDisplayError(error, "Could not submit your interest right now. Please try again."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  function parseFieldErrors(error) {
    if (!error || typeof error !== "object") return {};
    const pieces = [];
    const body = error.body;
    if (typeof body === "string") pieces.push(body);
    if (body && typeof body === "object") {
      pieces.push(body.message, body.error, body.details);
      if (typeof body.errors === "string") pieces.push(body.errors);
    }
    const text = pieces.filter(Boolean).join(" ");
    if (!text) return {};
    const parsed = {};
    if (/RegisterInterestRequest\.Location/i.test(text) || /Location.*required/i.test(text)) {
      parsed.location = "Please select a location.";
    }
    if (/RegisterInterestRequest\.PhoneNumber/i.test(text) || /PhoneNumber.*len/i.test(text)) {
      parsed.phone = "Please enter a valid phone number.";
    }
    if (/RegisterInterestRequest\.Email/i.test(text) || /Email.*failed on the 'email'/i.test(text)) {
      parsed.email = "Please provide a valid email address.";
    }
    return parsed;
  }

  const submitButtonClass =
    submitVariant === "inline-half"
      ? `landing-primary-button mt-[6px] h-[52px] w-1/2 rounded-[15px] text-[17px] desktop:h-auto desktop:text-[18px] ${submitButtonClassName}`
      : `w-full bg-brand-green px-6 py-4 font-display text-base font-semibold text-white shadow-none transition-all duration-200 active:scale-95 rounded-[14px] ${submitButtonClassName}`;

  return (
    <>
      <div className={wrapperClassName}>
        <form
          id={formId}
          onSubmit={handleSubmit}
          className={
            submitVariant === "footer-full"
              ? `${className}${className ? " " : ""}space-y-[22px]`
              : className
          }
        >
          <div className={submitVariant === "footer-full" ? "space-y-[22px]" : "contents"}>
        <div>
          <label htmlFor={`${idPrefix}-full-name`} className="landing-contact-label">
            Full Name
          </label>
          <input
            id={`${idPrefix}-full-name`}
            name="fullName"
            type="text"
            required
            placeholder="Enter full name"
            value={form.fullName}
            onChange={handleChange}
            className="landing-contact-field"
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-location`} className="landing-contact-label">
            Location
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}-location`}
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className={`landing-contact-field landing-contact-select appearance-none pr-10 ${
                form.location ? "text-landing-black" : "text-landing-green/45"
              }`}
            >
              <option value="" disabled>
                Select
              </option>
              {stateOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-landing-green/60"
              aria-hidden
            />
          </div>
          {fieldErrors.location ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-local-govt`} className="landing-contact-label">
            Local Govt
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}-local-govt`}
              name="localGovt"
              required
              value={form.localGovt}
              onChange={handleChange}
              disabled={!form.location || lgasLoading}
              className={`landing-contact-field landing-contact-select appearance-none pr-10 ${
                form.localGovt ? "text-landing-black" : "text-landing-green/45"
              } ${!form.location || lgasLoading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <option value="" disabled>
                {!form.location ? "Select state first" : lgasLoading ? "Loading local govts..." : "Select local govt"}
              </option>
              {lgaOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-landing-green/60"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-phone`} className="landing-contact-label">
            Phone Number
          </label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            required
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            className="landing-contact-field"
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-email`} className="landing-contact-label">
            Email(optional)
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            className="landing-contact-field"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        {submitVariant === "inline-half" ? (
          <button type="submit" className={submitButtonClass} style={{ boxShadow: "none" }} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        ) : null}

        {submitError ? (
          <p className="text-left text-sm font-medium text-red-600">{submitError}</p>
        ) : null}
          </div>

        {submitVariant === "footer-full" ? (
          <div className={`space-y-3 ${footerClassName}`}>
            <button type="submit" className={submitButtonClass} style={{ boxShadow: "none" }} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
            {submitError ? (
              <p className="text-left text-sm font-medium text-red-600">{submitError}</p>
            ) : null}
            {showAlreadyHaveAccount ? (
              <button
                type="button"
                onClick={() => navigate("/farmer/verify")}
                className="auth-btn-secondary"
              >
                I already have an account
              </button>
            ) : null}
          </div>
        ) : null}
        </form>
      </div>

      <StartJourneySuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}

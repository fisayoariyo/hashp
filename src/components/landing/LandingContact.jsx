import { useState } from "react";
import { LANDING_CONTACT } from "../../pages/landing/landingContent";

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
};

export default function LandingContact() {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setForm(INITIAL_FORM);
  };

  return (
    <section id="contact-us" className="landing-max bg-white px-5 py-[57px] tablet:px-10 desktop:px-[100px] desktop:py-[81px]">
      <div className="mx-auto flex max-w-[390px] flex-col items-center text-center tablet:max-w-[560px] desktop:max-w-none desktop:items-stretch desktop:text-left">
        <div className="flex flex-col items-center text-center desktop:hidden">
          <span className="landing-section-label text-landing-green">Contact us</span>
          <h2 className="mt-[16px] text-[24px] font-extrabold leading-[1.15] text-landing-green">
            {LANDING_CONTACT.title}
          </h2>
          <p className="mt-[14px] text-[13px] font-normal leading-[1.45] text-landing-green">
            {LANDING_CONTACT.description}
          </p>
        </div>

        <div className="grid w-full gap-10 self-stretch desktop:grid-cols-2 desktop:items-start desktop:gap-x-[48px] xl:gap-x-[100px]">
          <div className="w-full text-left">
            <div className="hidden desktop:block">
              <span className="landing-section-label text-landing-green">Contact us</span>
              <h2 className="mt-[16px] text-[35px] font-extrabold leading-[1.15] text-landing-green">
                {LANDING_CONTACT.title}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-[28px] w-full space-y-[18px] text-left desktop:mt-[38px]"
            >
              <div>
                <label htmlFor="contact-full-name" className="landing-contact-label">
                  Full Name
                </label>
                <input
                  id="contact-full-name"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="landing-contact-field"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="landing-contact-label">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="landing-contact-field"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="landing-contact-label">
                  Email(optional)
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="landing-contact-field"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="landing-contact-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="landing-contact-field min-h-[140px] resize-none desktop:min-h-[160px]"
                />
              </div>

              <button
                type="submit"
                className="landing-primary-button mt-[6px] h-[52px] w-full rounded-full text-[17px] desktop:h-auto desktop:w-1/2 desktop:rounded-[15px] desktop:text-[18px]"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="hidden flex-col gap-8 desktop:flex">
            <p className="text-[20px] font-normal leading-[1.5] text-landing-green">
              {LANDING_CONTACT.description}
            </p>
            <div className="overflow-hidden rounded-[15px]">
              <img
                src={LANDING_CONTACT.image.src}
                alt={LANDING_CONTACT.image.alt}
                className="h-[520px] w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

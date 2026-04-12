import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, Camera,
  ChevronDown, X, Plus, FileDown,
} from "lucide-react";
import { nigerianStates, nigerianLGAs } from "../../mockData/agent";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import AgentFacialVerification from "./AgentFacialVerification";
import AgentFingerprintVerification from "./AgentFingerprintVerification";
import { upsertFarmerInStorage } from "../../hooks/useAgentFarmersSync";

const DEMO_FARMER_PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop";

const DRAFT_KEY  = "hcx_reg_draft";
const getDraft   = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; } };
const setDraft   = (d) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...getDraft(), ...d })); } catch {} };
const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch {} };
const formatToday = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// ── Step indicator ─────────────────────────────────────────
function Steps({ current }) {
  return (
    <div className="flex items-center mb-8">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 transition-all border-2 ${
            s < current
              ? "bg-brand-green border-brand-green text-white"
              : s === current
              ? "bg-brand-green border-brand-green text-white"
              : "bg-white border-brand-border text-brand-text-muted"
          }`}>{s}</div>
          {i < 3 && (
            <div className={`flex-1 h-0.5 transition-all ${s < current ? "bg-brand-green" : "bg-brand-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Shared form helpers ────────────────────────────────────
const Input = ({ value, onChange, placeholder, type = "text", icon }) => (
  <div className="flex items-center input-field gap-3">
    {icon && <span className="text-brand-text-muted shrink-0">{icon}</span>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
  </div>
);
const Sel = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select value={value} onChange={onChange} className="input-field appearance-none pr-8 w-full">
      <option value="">{placeholder || "Select"}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
  </div>
);
const F = ({ label, required = false, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-sans text-sm font-medium text-brand-text-primary">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
const NavRow = ({ onBack, onNext, nextLabel = "Continue", disabled = false, layout = "fixed" }) => {
  const isFixed = layout === "fixed";
  return (
    <div
      className={
        isFixed
          ? "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 flex gap-3 border-t border-brand-border z-10"
          : "flex gap-3 w-full mt-auto pt-4 border-t border-brand-border shrink-0 justify-center flex-wrap"
      }
    >
      <button
        type="button"
        onClick={onBack}
        className={`flex items-center justify-center gap-1.5 py-3.5 rounded-3xl border-2 border-brand-green text-brand-green font-display font-semibold text-sm ${
          isFixed ? "flex-1" : "min-w-[150px] px-8"
        }`}
      >
        <ArrowLeft size={14} /> Go back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`flex items-center justify-center gap-1.5 py-3.5 px-8 rounded-3xl bg-brand-green text-white font-display font-semibold text-sm disabled:opacity-40 ${
          isFixed ? "flex-[1.35]" : "min-w-[160px]"
        }`}
      >
        {nextLabel} <ChevronRight size={14} />
      </button>
    </div>
  );
};

// ── Fingerprint swirl icon (for biometric rows) ────────────
function FPIcon({ color = "#9ca3af", size = 20 }) {
  const cx = size / 2, cy = size / 2, s = size / 20;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={size / 2 - 1} fill={`${color}18`} stroke={color} strokeWidth="1.5" />
      <path d={`M${cx - 3 * s},${cy + 2 * s} Q${cx - 3 * s},${cy - 4 * s} ${cx},${cy - 4 * s} Q${cx + 3 * s},${cy - 4 * s} ${cx + 3 * s},${cy + 2 * s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d={`M${cx - 5.5 * s},${cy + 2 * s} Q${cx - 5.5 * s},${cy - 6.5 * s} ${cx},${cy - 6.5 * s} Q${cx + 5.5 * s},${cy - 6.5 * s} ${cx + 5.5 * s},${cy + 2 * s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={0.8 * s} fill={color} />
    </svg>
  );
}

// ── RF01: Start screen ─────────────────────────────────────
// Icons: green rounded-square with white SVG icon (matches Figma RF01)
function StartScreen({ onStart, onBack, embedded }) {
  const STEPS = [
    {
      label: "Biometric Capture",
      sub: "Capture fingerprint and face for identity verification",
      icon: <FPIcon color="white" size={22} />,
    },
    {
      label: "Personal Information",
      sub: "Enter the farmer's basic details and identification number.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="9" y1="7" x2="15" y2="7"/>
          <line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
        </svg>
      ),
    },
    {
      label: "Farm Information",
      sub: "Provide details about the farm and crop type.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l3-5 4 2 3-6 4 4"/><path d="M5 20h14"/><circle cx="17" cy="8" r="2"/>
        </svg>
      ),
    },
    {
      label: "Cooperative & Association",
      sub: "Add cooperative details if the farmer belongs to one",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: "Review & Submit",
      sub: "Confirm all details and complete registration.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
    },
  ];

  const body = (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-5">
        <ArrowLeft size={18} />
        <span className="font-sans text-sm">Go back</span>
      </button>
      <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">Register new farmer</h1>
      <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-7">
        Begin a new farmer registration by capturing their personal and biometric details to create a verified profile.
      </p>
      <h2 className="font-display font-bold text-base text-brand-text-primary mb-4">Registration steps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {STEPS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm flex gap-3 items-start"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-green flex items-center justify-center shrink-0">{s.icon}</div>
            <div className="min-w-0 pt-0.5">
              <p className="font-sans font-bold text-sm text-brand-text-primary leading-snug">{s.label}</p>
              <p className="font-sans text-xs text-brand-text-secondary mt-1 leading-relaxed">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const startBtn = (
    <button type="button" onClick={onStart} className="btn-primary w-full max-w-xs px-8">
      Start Registration
    </button>
  );

  if (embedded) {
    return (
      <div className="flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]">
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">{body}</div>
        <div className="shrink-0 pt-4 border-t border-brand-border flex justify-center md:justify-start">
          {startBtn}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">{body}</div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 flex justify-center">
        {startBtn}
      </div>
    </div>
  );
}

// ── RF02/04/08: Biometric capture hub ─────────────────────
function BiometricStep({ faceCapture, fingerCapture, onFaceTap, onFingerTap, onNext, onBack, embedded }) {
  const done_color = "#155235";
  const idle_color = "#9ca3af";

  const Row = ({ label, subLabel, done, Icon, onTap }) => (
    <div>
      <p className="font-sans text-sm font-semibold text-brand-text-primary mb-2">{label}</p>
      <button
        onClick={!done ? onTap : undefined}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${
          done ? "bg-white border-brand-green/30" : "bg-white border-brand-border active:scale-[0.98]"
        }`}
      >
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
          done ? "border-brand-green bg-brand-green-muted" : "border-brand-border"
        }`}>
          <Icon color={done ? done_color : idle_color} size={20} />
        </div>
        <span className={`flex-1 text-left font-sans text-sm ${done ? "text-brand-green font-medium" : "text-brand-text-secondary"}`}>
          {done ? `${label.split(" ")[0]} verification successful` : subLabel}
        </span>
        {done
          ? <span className="text-brand-green text-base">✓</span>
          : <ChevronRight size={16} className="text-brand-text-muted shrink-0" />}
      </button>
    </div>
  );

  const FaceIcon = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <path d="M9 10.5c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"/>
    </svg>
  );

  const navLayout = embedded ? "inline" : "fixed";
  const scrollPb = embedded ? "pb-4" : "pb-32";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-white flex flex-col";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide min-h-0 ${scrollPb}`}>
        <Steps current={1} />
        <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">Biometric capture</h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-8">
          Capture fingerprint and face for identity verification.
        </p>
        <div className="space-y-5">
          <Row
            label="Face verification"
            subLabel="Capture your face to verify"
            done={faceCapture === "done"}
            Icon={FaceIcon}
            onTap={onFaceTap}
          />
          <Row
            label="Fingerprint verification"
            subLabel="Capture your finger to verify"
            done={fingerCapture === "done"}
            Icon={FPIcon}
            onTap={onFingerTap}
          />
        </div>
      </div>
      <NavRow
        layout={navLayout}
        onBack={onBack}
        onNext={() => {
          setDraft({ biometric: { face: true, fingerprint: true } });
          onNext();
        }}
        disabled={faceCapture !== "done" || fingerCapture !== "done"}
      />
    </div>
  );
}

// ── RF09: Personal info (all fields including optional) ────
function PersonalStep({ onNext, onBack, embedded }) {
  const d = getDraft().personal || {};
  const [form, setForm] = useState({
    fullName: "", phone: "", dob: "", gender: "Male",
    state: "", lga: "", address: "", nin: "", bvn: "",
    // Optional fields from RF09
    maritalStatus: "", educationLevel: "", yearsExperience: "",
    primaryCrops: [],
    nextKinName: "", nextKinPhone: "", nextKinRelationship: "",
    ...d,
  });
  const set = (k) => (e) => setForm((f) => ({
    ...f,
    [k]: e.target.value,
    ...(k === "state" ? { lga: "" } : {}),
  }));

  // Primary crop tags
  const CROP_OPTIONS = ["Maize","Rice","Cassava","Yam","Soybean","Green Beans","Tomato","Pepper","Groundnut","Wheat"];
  const addCrop = (crop) => {
    if (crop && !form.primaryCrops.includes(crop)) {
      setForm((f) => ({ ...f, primaryCrops: [...f.primaryCrops, crop] }));
    }
  };
  const removeCrop = (crop) => setForm((f) => ({ ...f, primaryCrops: f.primaryCrops.filter((c) => c !== crop) }));

  const navLayout = embedded ? "inline" : "fixed";
  const scrollPb = embedded ? "pb-4" : "pb-36";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-white flex flex-col";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide space-y-4 min-h-0 ${scrollPb}`}>
        <Steps current={2} />
        <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">
          Personal Information
        </h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-2">
          Enter the farmer's basic details and identification number.
        </p>

        {/* Upload picture */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-brand-border text-brand-text-secondary text-sm font-sans bg-white w-full">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Camera size={16} className="text-brand-text-muted" />
          </div>
          <span>Upload profile picture</span>
        </button>

        <F label="Full legal name" required>
          <Input value={form.fullName} onChange={set("fullName")} placeholder="Write farmer full name here"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        </F>

        <F label="Phone number" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>
            <div className="w-px h-5 bg-brand-border shrink-0" />
            <span className="text-sm text-brand-text-muted shrink-0">+234</span>
            <input type="tel" inputMode="numeric" value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
              placeholder="Input phone number here"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>

        <F label="Date of birth" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <input type="date" value={form.dob} onChange={set("dob")} placeholder="DD/MM/YYYY"
              className="flex-1 bg-transparent focus:outline-none text-sm text-brand-text-primary placeholder:text-brand-text-muted" />
          </div>
        </F>

        <F label="Gender" required><Sel value={form.gender} onChange={set("gender")} options={["Male","Female","Other"]} /></F>
        <F label="State of origin" required><Sel value={form.state} onChange={set("state")} options={nigerianStates} placeholder="Select" /></F>
        <F label="Local government area" required>
          <Sel
            value={form.lga}
            onChange={set("lga")}
            options={nigerianLGAs[form.state] || []}
            placeholder={form.state ? "Select LGA" : "Select state first"}
          />
        </F>
        <F label="Residential address" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input value={form.address} onChange={set("address")} placeholder="Write farmer full address here"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>
        <F label="NIN (National ID No.)" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h3m0 0v6m0-6h4"/></svg>
            <input value={form.nin} onChange={set("nin")} placeholder="Write farmer full name here"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>
        <F label="BVN" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h3m0 0v6m0-6h4"/></svg>
            <input value={form.bvn} onChange={set("bvn")} placeholder="Write farmer full name here"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>

        {/* Optional fields */}
        <F label="Marital Status (optional)">
          <Sel value={form.maritalStatus} onChange={set("maritalStatus")}
            options={["Single","Married","Divorced","Widowed"]} placeholder="Select" />
        </F>
        <F label="Education Level (optional)">
          <Sel value={form.educationLevel} onChange={set("educationLevel")}
            options={["No formal education","Primary","Secondary","OND/NCE","HND/BSc","Postgraduate"]} placeholder="Select" />
        </F>
        <F label="Years of Farming Experience (optional)">
          <Sel value={form.yearsExperience} onChange={set("yearsExperience")}
            options={["Less than 1 year","1-3 years","4-7 years","8-15 years","15+ years"]} placeholder="Select" />
        </F>

        {/* Primary Crops — tag pills */}
        <F label="Primary Crop(s) (optional)">
          <div className="flex flex-wrap gap-2 min-h-[42px] p-3 rounded-2xl border border-brand-border bg-white">
            {form.primaryCrops.map((crop) => (
              <span key={crop} className="flex items-center gap-1 bg-brand-green-muted text-brand-green text-xs font-sans font-medium px-2.5 py-1 rounded-full">
                {crop}
                <button onClick={() => removeCrop(crop)} className="hover:text-brand-green-dark">
                  <X size={11} />
                </button>
              </span>
            ))}
            <select onChange={(e) => { addCrop(e.target.value); e.target.value = ""; }}
              className="text-xs text-brand-text-muted bg-transparent focus:outline-none cursor-pointer">
              <option value="">+</option>
              {CROP_OPTIONS.filter((c) => !form.primaryCrops.includes(c)).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </F>

        {/* Next of Kin */}
        <F label="Next of Kin Name (optional)">
          <Input value={form.nextKinName} onChange={set("nextKinName")} placeholder="Write farmer next of kin name here"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        </F>
        <F label="Next of Kin Number (optional)">
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>
            <div className="w-px h-5 bg-brand-border shrink-0" />
            <span className="text-sm text-brand-text-muted shrink-0">+234</span>
            <input type="tel" inputMode="numeric" value={form.nextKinPhone}
              onChange={(e) => setForm((f) => ({ ...f, nextKinPhone: e.target.value.replace(/\D/g, "") }))}
              placeholder="Input your phone number here"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>
        <F label="Next of Kin Relationship (optional)">
          <Sel value={form.nextKinRelationship} onChange={set("nextKinRelationship")}
            options={["Spouse","Parent","Sibling","Child","Relative","Friend"]} placeholder="Select" />
        </F>
      </div>
      <NavRow layout={navLayout} onBack={onBack} onNext={() => { setDraft({ personal: form }); onNext(); }} />
    </div>
  );
}

// ── Farm info ──────────────────────────────────────────────
function FarmStep({ onNext, onBack, embedded }) {
  const d = getDraft().farm || {};
  const [form, setForm] = useState({ farmSize:"", cropType:"", landOwnership:"", ...d });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const navLayout = embedded ? "inline" : "fixed";
  const scrollPb = embedded ? "pb-4" : "pb-36";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-white flex flex-col";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide space-y-5 min-h-0 ${scrollPb}`}>
        <Steps current={3} />
        <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">Farm Information</h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-2">Enter basic details about the farmer's farm.</p>
        <F label="Farm Size" required>
          <div className="flex items-center input-field gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" className="shrink-0"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <input value={form.farmSize} onChange={set("farmSize")} placeholder="Enter farm size (e.g. 2 acres)"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>
        <F label="Crop Type" required>
          <Sel value={form.cropType} onChange={set("cropType")}
            options={["Maize","Rice","Cassava","Yam","Soybean","Green Beans","Tomato","Pepper","Groundnut"]}
            placeholder="Select crop type" />
        </F>
        <F label="Land Ownership (Optional)">
          <Sel value={form.landOwnership} onChange={set("landOwnership")}
            options={["Owned","Leased","Communal","Family"]}
            placeholder="Select ownership type (e.g. Owned, Leased)" />
        </F>
      </div>
      <NavRow layout={navLayout} onBack={onBack} onNext={() => { setDraft({ farm: form }); onNext(); }} />
    </div>
  );
}

// ── Cooperative info ───────────────────────────────────────
function CoopStep({ onNext, onBack, embedded }) {
  const d = getDraft().cooperative || {};
  const [form, setForm] = useState({ name:"",regNo:"",role:"Member",lga:"",commodity:"",size:"",landType:"",farmHect:"",supplier:"", ...d });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const navLayout = embedded ? "inline" : "fixed";
  const scrollPb = embedded ? "pb-4" : "pb-36";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-white flex flex-col";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide space-y-4 min-h-0 ${scrollPb}`}>
        <Steps current={4} />
        <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">Cooperative & Association</h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-2">Add cooperative details if the farmer belongs to one.</p>
        {[
          ["Cooperative Name","name",true,"Enter cooperative name"],
          ["Registration No.","regNo",true,"e.g. OY-COOP-2019-00441"],
          ["LGA of Cooperative","lga",false,"LGA"],
          ["Commodity Focus","commodity",false,"e.g. Maize, Cassava"],
          ["Cooperative Size (members)","size",false,"e.g. 120"],
          ["Farm Size (Hectares)","farmHect",false,"e.g. 2"],
          ["Input Supplier","supplier",false,"Optional"],
        ].map(([label, key, req, ph]) => (
          <F key={key} label={label} required={req}>
            <Input value={form[key]} onChange={set(key)} placeholder={ph} />
          </F>
        ))}
        <F label="Membership Role">
          <Sel value={form.role} onChange={set("role")} options={["Member","Secretary","Chairman","Treasurer"]} />
        </F>
        <F label="Land Ownership Type">
          <Sel value={form.landType} onChange={set("landType")} options={["Owned","Leased","Communal","Family"]} placeholder="Select" />
        </F>
      </div>
      <NavRow
        layout={navLayout}
        onBack={onBack}
        onNext={() => { setDraft({ cooperative: form }); onNext(); }}
        nextLabel="Review"
      />
    </div>
  );
}

// ── RF12: Review — flat label:bold-value list (no cards) ───
function ReviewStep({ onSubmit, onBack, submitting, embedded, submitError }) {
  const d = getDraft();
  const p = d.personal   || {};
  const f = d.farm       || {};
  const c = d.cooperative || {};

  const Section = ({ title, rows }) => (
    <div className="mb-5">
      <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-1.5">
        {rows.filter(([, v]) => v).map(([label, value]) => (
          <p key={label} className="font-sans text-sm text-brand-text-primary leading-snug">
            {label} : <span className="font-bold">{value}</span>
          </p>
        ))}
      </div>
    </div>
  );

  const footerClass =
    embedded
      ? "mt-6 pt-4 border-t border-brand-border space-y-3 w-full shrink-0"
      : "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 space-y-3 z-10";
  const scrollPb = embedded ? "pb-4" : "pb-36";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-container";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide min-h-0 ${scrollPb}`}>
        <h1 className="font-display font-bold text-2xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">Review Details</h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-6">
          Please review all information before submitting.
        </p>
        {submitError && (
          <p className="font-sans text-sm text-red-600 mb-4" role="alert">
            {submitError}
          </p>
        )}

        <Section title="Biometric Information" rows={[
          ["Fingerprint", "Captured"],
          ["Face", "Captured"],
        ]} />

        <Section title="Personal Information" rows={[
          ["Full Name",    p.fullName],
          ["Date of Birth", p.dob],
          ["Gender",       p.gender],
          ["Phone Number", p.phone],
          ["Address",      p.address],
          ["NIN",          p.nin],
        ]} />

        <Section title="Farm Information" rows={[
          ["Farm Size",      f.farmSize],
          ["Crop Type",      f.cropType],
          ["Land Ownership", f.landOwnership],
        ]} />

        <Section title="Cooperative & Association" rows={[
          ["Cooperative Name",    c.name],
          ["Registration Number", c.regNo],
          ["Membership Role",     c.role],
          ["LGA",                 c.lga],
          ["Commodity Focus",     c.commodity],
          ["Cooperative Size",    c.size ? `${c.size} members` : undefined],
          ["Land Ownership Type", c.landType],
          ["Farm Size (Hectares)", c.farmHect ? `${c.farmHect} hectares` : undefined],
          ["Input Supplier",      c.supplier],
        ]} />
      </div>

      <div
        className={`${footerClass} flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center ${
          embedded ? "sm:justify-start" : ""
        } justify-center`}
      >
        <button
          type="button"
          onClick={onBack}
          className="order-2 sm:order-1 min-w-[140px] h-[44px] px-5 rounded-2xl border-2 border-brand-border text-brand-text-primary font-sans font-semibold text-sm inline-flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          Edit details
        </button>
        <button
          type="button"
          onClick={() => {
            const blob = new Blob(["Demo CSV export — connect API for real data"], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "farmer-review-demo.csv";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
          className="order-3 sm:order-2 min-w-[140px] h-[44px] px-5 rounded-2xl border-2 border-brand-border text-brand-text-primary font-sans font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <FileDown size={16} /> Download as CSV
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="order-1 sm:order-3 min-w-[180px] h-[44px] w-full sm:w-auto px-8 rounded-2xl bg-brand-green text-white font-sans font-semibold text-sm inline-flex items-center justify-center transition-all duration-200 active:scale-95 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Continue and submit"}
        </button>
      </div>
    </div>
  );
}

// ── RF13: Done screen ──────────────────────────────────────
function DoneStep({ idCard, onRegisterAnother, onGoHome, embedded }) {
  const footerClass =
    embedded
      ? "mt-6 pt-4 border-t border-brand-border space-y-3 w-full shrink-0"
      : "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 space-y-3 z-10";
  const scrollPb = embedded ? "pb-4" : "pb-36";
  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)]"
    : "page-container";

  return (
    <div className={rootClass}>
      <div className={`flex-1 px-4 pt-5 overflow-y-auto scrollbar-hide min-h-0 ${scrollPb}`}>
        <button onClick={onGoHome} className="flex items-center gap-2 text-brand-text-secondary mb-4">
          <ArrowLeft size={16} /><span className="font-sans text-sm">Go back home</span>
        </button>

        <h1 className="font-display font-bold text-2xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">Farmer ID</h1>
        <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-5">
          Farmer has been successfully registered. View and share their ID below.
        </p>

        {/* Green ID card — compact width to match desktop reference */}
        <div className="max-w-sm mx-auto w-full bg-brand-green rounded-2xl p-4 flex flex-col items-center text-white shadow-md">
          {/* HFEI Primary Logo White on green ID card */}
          <div className="self-start mb-3">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by Hashmar Cropex Ltd"
              className="h-7 w-auto object-contain"
              draggable="false"
            />
          </div>

          {/* Photo — reference size for biometric capture pill width */}
          <img src={idCard.photo || DEMO_FARMER_PHOTO} alt={idCard.name}
            className="w-28 h-28 rounded-2xl object-cover border-[3px] border-white/35 mb-3" />

          <div className="text-center mb-2">
            <p className="text-white/60 text-[11px]">Full Name</p>
            <p className="font-display font-bold text-lg mt-0.5 leading-tight">{idCard.name}</p>
          </div>
          <div className="text-center mb-2">
            <p className="text-white/60 text-[11px]">Farmer ID</p>
            <p className="font-display font-bold text-sm tracking-widest mt-0.5 break-all px-1">{idCard.farmerID}</p>
          </div>
          <div className="text-center mb-3">
            <p className="text-white/60 text-[11px]">Corporative name</p>
            <p className="font-display font-semibold text-sm mt-0.5">{idCard.cooperative || "—"}</p>
          </div>

          <div className="w-full h-px bg-white/20 mb-3" />

          <div className="grid grid-cols-2 gap-3 w-full mb-3 text-left">
            <div><p className="text-white/60 text-[11px]">Agent name</p><p className="font-sans font-semibold text-xs mt-0.5">Adesipe Tomide</p></div>
            <div><p className="text-white/60 text-[11px]">Agent signature</p><p className="font-sans italic text-xs mt-0.5 text-white/85">Paladise</p></div>
          </div>
          <div className="flex items-center justify-center gap-5 w-full">
            <div className="text-center"><p className="text-white/60 text-[11px]">Issue date</p><p className="font-display font-bold text-xs mt-0.5">20/04/2026</p></div>
            <div className="w-px h-7 bg-white/30" />
            <div className="text-center"><p className="text-white/60 text-[11px]">Expiry date</p><p className="font-display font-bold text-xs mt-0.5">20/04/2027</p></div>
          </div>
        </div>
      </div>

      <div
        className={`${footerClass} flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-stretch`}
      >
        <button
          type="button"
          onClick={() => {
            const msg = `Farmer ID: *${idCard.farmerID}*\nName: ${idCard.name}\nVerify: https://cropex.hashmarcropex.com/verify/${idCard.farmerID}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
          }}
          className="order-2 sm:order-1 inline-flex items-center justify-center min-h-12 py-2.5 box-border px-8 rounded-full border-2 border-brand-green bg-white text-brand-green font-display font-semibold text-sm hover:bg-brand-green/5 transition-colors w-full sm:w-auto sm:min-w-[11rem] text-center leading-snug"
        >
          Share ID
        </button>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="order-1 sm:order-2 inline-flex items-center justify-center min-h-12 py-2.5 box-border px-8 rounded-full border-2 border-brand-green bg-brand-green text-white font-display font-semibold text-sm hover:brightness-95 active:scale-[0.99] transition-all w-full sm:w-auto sm:min-w-[13rem] text-center leading-snug"
        >
          Register Another Farmer
        </button>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────
export default function AgentRegisterFarmer() {
  const navigate  = useNavigate();
  const [step, setStep]           = useState("start");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [idCard, setIdCard]         = useState(null);

  // Biometric state LIFTED — survives sub-screen navigation
  const [faceCapture,   setFaceCapture]   = useState("idle");
  const [fingerCapture, setFingerCapture] = useState("idle");

  const goHome = () => navigate("/agent/home");

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    const draft = getDraft();
    try {
      await new Promise((r) => setTimeout(r, 700));
      const id =
        `HSH-IB-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
      setIdCard({
        farmerID: String(id),
        name: draft.personal?.fullName || "New Farmer",
        photo: DEMO_FARMER_PHOTO,
        cooperative: draft.cooperative?.name || "—",
      });

      upsertFarmerInStorage({
        id: String(id),
        name: draft.personal?.fullName || "New Farmer",
        photo: DEMO_FARMER_PHOTO,
        regDate: formatToday(),
        status: "pending",
        primaryCrop: draft.farm?.cropType || draft.personal?.primaryCrops?.[0] || "—",
        state: draft.personal?.state || "—",
        lga: draft.personal?.lga || "—",
        phone: draft.personal?.phone || "—",
        cooperative: draft.cooperative?.name || "—",
        farmSize: draft.farm?.farmSize || "—",
        landOwnership: draft.farm?.landOwnership || "—",
        gender: draft.personal?.gender || "—",
        dob: draft.personal?.dob || "—",
        nin: draft.personal?.nin || "—",
        address: draft.personal?.address || "—",
        biometric: { face: true, fingerprint: true },
      });

      clearDraft();
      setStep("done");
      window.dispatchEvent(new CustomEvent("hcx-farmers-refresh"));
      window.dispatchEvent(new CustomEvent("hcx-farmers-sync"));
    } catch {
      setSubmitError("Enrollment failed. Check required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  // Biometric sub-screens (inline — no route change)
  if (step === "face-capture") {
    return (
      <>
        <div className="md:hidden">
          <AgentFacialVerification
            onSuccess={() => { setFaceCapture("done"); setStep("biometric"); }}
            onBack={() => setStep("biometric")}
          />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <AgentFacialVerification
              embedded
              onSuccess={() => { setFaceCapture("done"); setStep("biometric"); }}
              onBack={() => setStep("biometric")}
            />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "fingerprint-capture") {
    return (
      <>
        <div className="md:hidden">
          <AgentFingerprintVerification
            onSuccess={() => { setFingerCapture("done"); setStep("biometric"); }}
            onBack={() => setStep("biometric")}
          />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <AgentFingerprintVerification
              embedded
              onSuccess={() => { setFingerCapture("done"); setStep("biometric"); }}
              onBack={() => setStep("biometric")}
            />
          </div>
        </AgentDesktopShell>
      </>
    );
  }

  if (step === "start") {
    return (
      <>
        <div className="md:hidden">
          <StartScreen onStart={() => setStep("biometric")} onBack={goHome} />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <StartScreen embedded onStart={() => setStep("biometric")} onBack={goHome} />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "biometric") {
    return (
      <>
        <div className="md:hidden">
          <BiometricStep
            faceCapture={faceCapture}
            fingerCapture={fingerCapture}
            onFaceTap={() => setStep("face-capture")}
            onFingerTap={() => setStep("fingerprint-capture")}
            onNext={() => setStep("personal")}
            onBack={() => setStep("start")}
          />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <BiometricStep
              embedded
              faceCapture={faceCapture}
              fingerCapture={fingerCapture}
              onFaceTap={() => setStep("face-capture")}
              onFingerTap={() => setStep("fingerprint-capture")}
              onNext={() => setStep("personal")}
              onBack={() => setStep("start")}
            />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "personal") {
    return (
      <>
        <div className="md:hidden">
          <PersonalStep onNext={() => setStep("farm")} onBack={() => setStep("biometric")} />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <PersonalStep embedded onNext={() => setStep("farm")} onBack={() => setStep("biometric")} />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "farm") {
    return (
      <>
        <div className="md:hidden">
          <FarmStep onNext={() => setStep("coop")} onBack={() => setStep("personal")} />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <FarmStep embedded onNext={() => setStep("coop")} onBack={() => setStep("personal")} />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "coop") {
    return (
      <>
        <div className="md:hidden">
          <CoopStep onNext={() => setStep("review")} onBack={() => setStep("farm")} />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <CoopStep embedded onNext={() => setStep("review")} onBack={() => setStep("farm")} />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "review") {
    return (
      <>
        <div className="md:hidden">
          <ReviewStep
            onSubmit={handleSubmit}
            onBack={() => setStep("coop")}
            submitting={submitting}
            submitError={submitError}
          />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <ReviewStep
              embedded
              onSubmit={handleSubmit}
              onBack={() => setStep("coop")}
              submitting={submitting}
              submitError={submitError}
            />
          </div>
        </AgentDesktopShell>
      </>
    );
  }
  if (step === "done") {
    return (
      <>
        <div className="md:hidden">
          <DoneStep
            idCard={idCard}
            onRegisterAnother={() => { setFaceCapture("idle"); setFingerCapture("idle"); setStep("start"); }}
            onGoHome={goHome}
          />
        </div>
        <AgentDesktopShell active="farmers">
          <div className="w-full max-w-[862.81px]">
            <DoneStep
              embedded
              idCard={idCard}
              onRegisterAnother={() => { setFaceCapture("idle"); setFingerCapture("idle"); setStep("start"); }}
              onGoHome={goHome}
            />
          </div>
        </AgentDesktopShell>
      </>
    );
  }

  return null;
}

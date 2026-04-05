import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ScanFace, Fingerprint, Check, Camera, ChevronDown, Plus, MessageCircle, Smartphone } from "lucide-react";
import { nigerianStates } from "../../mockData/agent";

const DRAFT_KEY = "hcx_reg_draft";
const getDraft = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; } };
const setDraft = (d) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...getDraft(), ...d })); } catch {} };
const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch {} };

// ── Step indicator ─────────────────────────────────────────
function Steps({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 transition-all ${
            s <= current ? "bg-brand-green text-white" : "bg-white border-2 border-brand-border text-brand-text-muted"
          }`}>{s}</div>
          {i < 3 && <div className={`flex-1 h-0.5 transition-all ${s < current ? "bg-brand-green" : "bg-brand-border"}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Shared form helpers ────────────────────────────────────
const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
);
const Sel = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select value={value} onChange={onChange} className="input-field appearance-none">
      <option value="">{placeholder || "Select"}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
  </div>
);
const F = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-sans text-sm font-medium text-brand-text-primary">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
const NavRow = ({ onBack, onNext, nextLabel = "Continue", disabled = false }) => (
  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 flex gap-3 border-t border-brand-border">
    <button onClick={onBack} className="flex-1 flex items-center justify-center gap-1.5 py-4 rounded-3xl border-2 border-brand-green text-brand-green font-display font-semibold text-sm">
      <ArrowLeft size={14} /> Go back
    </button>
    <button onClick={onNext} disabled={disabled}
      className="flex-2 flex items-center justify-center gap-1.5 py-4 px-8 rounded-3xl bg-brand-green text-white font-display font-semibold text-sm disabled:opacity-40">
      {nextLabel} <ChevronRight size={14} />
    </button>
  </div>
);

// ── STEP 0: Start screen ───────────────────────────────────
function StartScreen({ onStart, onBack }) {
  const STEPS = [
    { icon: "🫆", label: "Biometric Capture", sub: "Capture fingerprint and face for identity verification" },
    { icon: "📋", label: "Personal Information", sub: "Enter the farmer's basic details and identification number." },
    { icon: "🚜", label: "Farm Information", sub: "Provide details about the farm and crop type." },
    { icon: "🤝", label: "Cooperative & Association", sub: "Add cooperative details if the farmer belongs to one" },
    { icon: "✅", label: "Review & Submit", sub: "Confirm all details and complete registration." },
  ];
  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-5">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Register new farmer</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-7">
          Begin a new farmer registration by capturing their personal and biometric details.
        </p>
        <h2 className="font-display font-bold text-base text-brand-text-primary mb-4">Registration steps</h2>
        <div className="space-y-0">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-xl bg-brand-green flex items-center justify-center text-xl shrink-0">{s.icon}</div>
                {i < STEPS.length - 1 && <div className="w-0 border-l-2 border-dashed border-brand-border h-8 my-0.5" />}
              </div>
              <div className="pb-4">
                <p className="font-sans font-bold text-sm text-brand-text-primary">{s.label}</p>
                <p className="font-sans text-xs text-brand-text-secondary mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3">
        <button onClick={onStart} className="btn-primary">Start Registration</button>
      </div>
    </div>
  );
}

// ── STEP 1: Biometrics ─────────────────────────────────────
function BiometricStep({ onNext, onBack }) {
  const [face, setFace] = useState("idle");
  const [finger, setFinger] = useState("idle");

  const Row = ({ label, subLabel, Icon, state, onCapture }) => (
    <div>
      <p className="font-sans text-sm font-semibold text-brand-text-primary mb-2">{label}</p>
      <button onClick={state === "idle" ? onCapture : undefined}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${state === "done" ? "bg-white border-brand-green/40" : "bg-white border-brand-border"}`}>
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${state === "done" ? "border-brand-green text-brand-green" : "border-brand-border text-brand-text-muted"}`}>
          {state === "loading" || state === "scanning"
            ? <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            : <Icon size={18} strokeWidth={1.5} />}
        </div>
        <span className={`flex-1 text-left font-sans text-sm ${state === "done" ? "text-brand-green font-medium" : "text-brand-text-secondary"}`}>
          {state === "done" ? `${label.split(" ")[0]} captured ✓` : subLabel}
        </span>
        {state !== "done" && <ChevronRight size={16} className="text-brand-text-muted shrink-0" />}
      </button>
    </div>
  );

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto scrollbar-hide">
        <Steps current={1} />
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Biometric capture</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">Capture fingerprint and face for identity verification.</p>
        <div className="space-y-5">
          <Row label="Face verification" subLabel="Capture your face to verify" Icon={ScanFace} state={face}
            onCapture={() => { setFace("loading"); setTimeout(() => setFace("done"), 1500); }} />
          <Row label="Fingerprint verification" subLabel="Capture your finger to verify" Icon={Fingerprint} state={finger}
            onCapture={() => { setFinger("scanning"); setTimeout(() => setFinger("done"), 2000); }} />
        </div>
      </div>
      <NavRow onBack={onBack}
        onNext={() => { setDraft({ biometric: { face: true, fingerprint: true } }); onNext(); }}
        disabled={face !== "done" || finger !== "done"} />
    </div>
  );
}

// ── STEP 2: Personal info ──────────────────────────────────
function PersonalStep({ onNext, onBack }) {
  const d = getDraft().personal || {};
  const [form, setForm] = useState({ fullName:"",phone:"",dob:"",gender:"Male",state:"",lga:"",address:"",nin:"",bvn:"", ...d });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide space-y-4">
        <Steps current={2} />
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Personal Information</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-2">Enter the farmer's basic details and identification number.</p>
        <button className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-brand-border text-brand-text-secondary text-sm font-sans">
          <Camera size={18} /> Upload profile picture
        </button>
        <F label="Full legal name" required><Input value={form.fullName} onChange={set("fullName")} placeholder="Write farmer full name here" /></F>
        <F label="Phone number" required>
          <div className="flex items-center input-field gap-3">
            <span className="text-brand-text-muted text-sm shrink-0">+234</span>
            <div className="w-px h-5 bg-brand-border shrink-0" />
            <input type="tel" inputMode="numeric" value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
              placeholder="Input phone number here" className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-brand-text-muted" />
          </div>
        </F>
        <F label="Date of birth" required><Input type="date" value={form.dob} onChange={set("dob")} placeholder="DD/MM/YYYY" /></F>
        <F label="Gender" required><Sel value={form.gender} onChange={set("gender")} options={["Male","Female","Other"]} /></F>
        <F label="State of origin" required><Sel value={form.state} onChange={set("state")} options={nigerianStates} placeholder="Select" /></F>
        <F label="Local government area" required><Sel value={form.lga} onChange={set("lga")} options={["Ibadan North","Ibadan South","Ogbomoso","Oyo East"]} placeholder="Select" /></F>
        <F label="Residential address" required><Input value={form.address} onChange={set("address")} placeholder="Write residential address" /></F>
        <F label="NIN (National ID No.)" required><Input value={form.nin} onChange={set("nin")} placeholder="11-digit NIN" /></F>
        <F label="BVN" required><Input value={form.bvn} onChange={set("bvn")} placeholder="11-digit BVN" /></F>
      </div>
      <NavRow onBack={onBack} onNext={() => { setDraft({ personal: form }); onNext(); }} />
    </div>
  );
}

// ── STEP 3: Farm info ──────────────────────────────────────
function FarmStep({ onNext, onBack }) {
  const d = getDraft().farm || {};
  const [form, setForm] = useState({ farmSize:"",cropType:"",landOwnership:"", ...d });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide space-y-5">
        <Steps current={3} />
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Farm Information</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-2">Enter basic details about the farmer's farm.</p>
        <F label="Farm Size" required><Input value={form.farmSize} onChange={set("farmSize")} placeholder="Enter farm size (e.g. 2 acres)" /></F>
        <F label="Crop Type" required>
          <Sel value={form.cropType} onChange={set("cropType")}
            options={["Maize","Rice","Cassava","Yam","Soybean","Green Beans","Tomato","Pepper","Groundnut"]}
            placeholder="Select crop type" />
        </F>
        <F label="Land Ownership (Optional)">
          <Sel value={form.landOwnership} onChange={set("landOwnership")}
            options={["Owned","Leased","Communal","Family"]}
            placeholder="Select ownership type" />
        </F>
      </div>
      <NavRow onBack={onBack} onNext={() => { setDraft({ farm: form }); onNext(); }} />
    </div>
  );
}

// ── STEP 4: Cooperative ────────────────────────────────────
function CoopStep({ onNext, onBack }) {
  const d = getDraft().cooperative || {};
  const [form, setForm] = useState({ name:"",regNo:"",role:"Member",lga:"",commodity:"",size:"",landType:"",farmHect:"",supplier:"", ...d });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide space-y-4">
        <Steps current={4} />
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Cooperative & Association</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-2">Add cooperative details if the farmer belongs to one.</p>
        {[["Cooperative Name","name",true,"Enter cooperative name"],["Registration No.","regNo",true,"e.g. OY-COOP-2019-00441"],["LGA of Cooperative","lga",false,"LGA"],["Commodity Focus","commodity",false,"e.g. Maize, Cassava"],["Cooperative Size (members)","size",false,"e.g. 120"],["Farm Size (Hectares)","farmHect",false,"e.g. 2"],["Input Supplier","supplier",false,"Optional"]].map(([label,key,req,ph]) => (
          <F key={key} label={label} required={req}><Input value={form[key]} onChange={set(key)} placeholder={ph} /></F>
        ))}
        <F label="Membership Role"><Sel value={form.role} onChange={set("role")} options={["Member","Secretary","Chairman","Treasurer"]} /></F>
        <F label="Land Ownership Type"><Sel value={form.landType} onChange={set("landType")} options={["Owned","Leased","Communal","Family"]} placeholder="Select" /></F>
      </div>
      <NavRow onBack={onBack} onNext={() => { setDraft({ cooperative: form }); onNext(); }} nextLabel="Review" />
    </div>
  );
}

// ── STEP 5: Review ─────────────────────────────────────────
function ReviewStep({ onSubmit, onBack, submitting }) {
  const draft = getDraft();
  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-brand-border last:border-0">
      <span className="font-sans text-xs text-brand-text-muted">{label}</span>
      <span className="font-sans text-xs font-semibold text-brand-text-primary text-right max-w-[55%]">{value || "—"}</span>
    </div>
  );
  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-4">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Review Details</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-5">Confirm all details before submitting.</p>
        {[
          { title:"Biometric", rows:[["Face","Captured"],["Fingerprint","Captured"]] },
          { title:"Personal Info", rows:[["Name",draft.personal?.fullName],["Phone",draft.personal?.phone],["DOB",draft.personal?.dob],["Gender",draft.personal?.gender],["State",draft.personal?.state],["Address",draft.personal?.address]] },
          { title:"Farm Info", rows:[["Farm Size",draft.farm?.farmSize],["Crop Type",draft.farm?.cropType],["Land Ownership",draft.farm?.landOwnership]] },
          { title:"Cooperative", rows:[["Name",draft.cooperative?.name],["Reg. No.",draft.cooperative?.regNo],["Role",draft.cooperative?.role]] },
        ].map(({ title, rows }) => (
          <div key={title} className="bg-white rounded-2xl p-4 mb-3">
            <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">{title}</p>
            {rows.map(([label, value]) => <Row key={label} label={label} value={value} />)}
          </div>
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onSubmit} nextLabel={submitting ? "Submitting..." : "Submit"} disabled={submitting} />
    </div>
  );
}

// ── STEP 6: Done ───────────────────────────────────────────
function DoneStep({ idCard, onRegisterAnother }) {
  const shareViaWhatsApp = () => {
    const msg = `Farmer ID: *${idCard.farmerID}*\nName: ${idCard.name}\nVerify: https://cropex.hashmarcropex.com/verify/${idCard.farmerID}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide">
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Farmer ID</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-5">
          Farmer has been successfully registered. View and share their ID below.
        </p>
        <div className="bg-brand-green rounded-3xl p-5 flex flex-col items-center text-white">
          <div className="flex items-center gap-2 self-start mb-4">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="font-bold text-xs text-white">H</span>
            </div>
            <span className="font-display font-black text-sm tracking-widest">HASHMAR CROPEX LIMITED</span>
          </div>
          <img src={idCard.photo || "https://via.placeholder.com/150"} alt={idCard.name}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 mb-3" />
          <div className="text-center mb-2"><p className="text-white/60 text-xs">Full Name</p><p className="font-display font-bold text-lg">{idCard.name}</p></div>
          <div className="text-center mb-2"><p className="text-white/60 text-xs">Farmer ID</p><p className="font-display font-bold text-base tracking-widest">{idCard.farmerID}</p></div>
          <div className="text-center mb-4"><p className="text-white/60 text-xs">Corporative name</p><p className="font-display font-bold text-sm">{idCard.cooperative}</p></div>
          <div className="w-full h-px bg-white/20 mb-3" />
          <div className="grid grid-cols-2 gap-4 w-full mb-3">
            <div><p className="text-white/60 text-xs">Agent name</p><p className="font-sans font-semibold text-sm">Adesipe Tomide</p></div>
            <div><p className="text-white/60 text-xs">Agent signature</p><p className="font-sans italic text-sm text-white/80">Paladise</p></div>
          </div>
          <div className="flex items-center justify-center gap-6 w-full">
            <div className="text-center"><p className="text-white/60 text-xs">Issue date</p><p className="font-display font-bold text-sm">20/04/2026</p></div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center"><p className="text-white/60 text-xs">Expiry date</p><p className="font-display font-bold text-sm">20/04/2027</p></div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 space-y-3">
        <button onClick={onRegisterAnother} className="btn-primary">Register Another Farmer</button>
        <button onClick={shareViaWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-brand-green text-brand-green font-sans font-semibold text-sm">
          <MessageCircle size={16} /> Share ID
        </button>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────
export default function AgentRegisterFarmer() {
  const navigate = useNavigate();
  const [step, setStep] = useState("start");
  const [submitting, setSubmitting] = useState(false);
  const [idCard, setIdCard] = useState(null);

  const goHome = () => navigate("/agent/home");

  const handleSubmit = async () => {
    setSubmitting(true);
    const draft = getDraft();
    await new Promise((r) => setTimeout(r, 1200));
    const id = `HSH-IB-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
    setIdCard({
      farmerID: id,
      name: draft.personal?.fullName || "New Farmer",
      photo: "https://via.placeholder.com/150",
      cooperative: draft.cooperative?.name || "—",
    });
    clearDraft();
    setSubmitting(false);
    setStep("done");
  };

  if (step === "start")   return <StartScreen onStart={() => setStep("biometric")} onBack={goHome} />;
  if (step === "biometric") return <BiometricStep onNext={() => setStep("personal")} onBack={() => setStep("start")} />;
  if (step === "personal")  return <PersonalStep onNext={() => setStep("farm")} onBack={() => setStep("biometric")} />;
  if (step === "farm")      return <FarmStep onNext={() => setStep("coop")} onBack={() => setStep("personal")} />;
  if (step === "coop")      return <CoopStep onNext={() => setStep("review")} onBack={() => setStep("farm")} />;
  if (step === "review")    return <ReviewStep onSubmit={handleSubmit} onBack={() => setStep("coop")} submitting={submitting} />;
  if (step === "done")      return <DoneStep idCard={idCard} onRegisterAnother={() => { setStep("start"); }} />;
  return null;
}

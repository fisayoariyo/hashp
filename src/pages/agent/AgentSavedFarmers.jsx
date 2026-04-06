import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, MessageCircle, Smartphone } from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import { agentData, agentRegisteredFarmers } from "../../mockData/agent";

// ── Farmer card ────────────────────────────────────────────
function FarmerCard({ farmer, onView }) {
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col gap-3 relative">
      {farmer.status === "pending" && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-brand-amber">
          <RefreshCw size={11} /><span className="text-[10px] font-sans font-semibold">Sync now</span>
        </div>
      )}
      <img src={farmer.photo} alt={farmer.name} className="w-full aspect-square object-cover rounded-xl" />
      <div className="space-y-0.5">
        <p className="font-sans text-xs"><span className="text-brand-text-muted">Name : </span>{farmer.name}</p>
        <p className="font-sans text-xs"><span className="text-brand-text-muted">ID : </span>{farmer.id}</p>
        <p className="font-sans text-xs"><span className="text-brand-text-muted">Reg date: </span>{farmer.regDate}</p>
        <p className="font-sans text-xs font-semibold">
          <span className="text-brand-text-muted font-normal">Status : </span>
          <span className={farmer.status === "synced" ? "text-brand-green" : "text-brand-amber"}>
            {farmer.status === "synced" ? "Synced" : "Sync pending"}
          </span>
        </p>
      </div>
      <button onClick={onView}
        className="w-full py-2.5 rounded-xl bg-brand-green text-white font-sans font-semibold text-xs">
        View Details
      </button>
    </div>
  );
}

// ── Farmers list ───────────────────────────────────────────
function FarmersList({ onSelect }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const farmers = agentRegisteredFarmers;
  const filtered = farmers.filter((f) => {
    const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.id.toLowerCase().includes(query.toLowerCase());
    const matchS = statusFilter === "all" || f.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 pb-28 overflow-y-auto scrollbar-hide">
        <div className="px-4 pt-5">
          <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Registered Farmers</h1>
          <p className="font-sans text-sm text-brand-text-secondary mb-3">View all registered farmers and their sync status.</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-brand-green" />
                <span className="font-sans text-xs font-semibold">{farmers.filter(f=>f.status==="synced").length} Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-brand-amber" />
                <span className="font-sans text-xs font-semibold">{farmers.filter(f=>f.status==="pending").length} Pending</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-green text-white text-xs font-semibold">
              <RefreshCw size={12} /> Sync now
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex items-center bg-white border border-brand-border rounded-2xl px-3 gap-2">
              <span className="text-brand-text-muted">🔍</span>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search farmer by name, farmer ID...."
                className="flex-1 py-3 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted" />
            </div>
            <button className="px-4 py-3 bg-brand-green rounded-2xl text-white font-sans text-sm font-semibold">Search</button>
          </div>
          <div className="flex gap-2 mb-3">
            {[["all","All"],["synced","Synced"],["pending","Pending"]].map(([val,label]) => (
              <button key={val} onClick={() => setStatusFilter(val)}
                className={`px-3 py-1.5 rounded-full border text-xs font-sans font-medium transition-all ${statusFilter === val ? "bg-brand-green text-white border-brand-green" : "bg-white text-brand-text-secondary border-brand-border"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {filtered.map((f) => <FarmerCard key={f.id} farmer={f} onView={() => onSelect(f)} />)}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-10 text-brand-text-muted font-sans text-sm">No farmers found</div>
          )}
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
}

// ── Farmer Detail ──────────────────────────────────────────
function FarmerDetail({ farmer, onBack, onViewID }) {
  const Row = ({ label, value }) => (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-brand-border last:border-0">
      <p className="font-sans text-xs text-brand-text-muted">{label}</p>
      <p className="font-sans text-sm font-semibold text-brand-text-primary">{value || "—"}</p>
    </div>
  );
  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-4">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <div className="flex items-center gap-3 mb-5">
          <img src={farmer.photo} alt={farmer.name} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <p className="font-display font-bold text-lg text-brand-text-primary">{farmer.name}</p>
            <p className="font-sans text-sm text-brand-text-secondary">{farmer.id}</p>
            <span className={`text-xs font-semibold ${farmer.status === "synced" ? "text-brand-green" : "text-brand-amber"}`}>
              {farmer.status === "synced" ? "✓ Synced" : "⟳ Sync pending"}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 mb-3">
          <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">Biometrics</p>
          <Row label="Face" value={farmer.biometric?.face ? "Captured" : "Not captured"} />
          <Row label="Fingerprint" value={farmer.biometric?.fingerprint ? "Captured" : "Not captured"} />
        </div>
        <div className="bg-white rounded-2xl p-4 mb-3">
          <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">Personal Info</p>
          <Row label="Full Name" value={farmer.name} />
          <Row label="Phone" value={farmer.phone} />
          <Row label="Gender" value={farmer.gender} />
          <Row label="State" value={farmer.state} />
          <Row label="LGA" value={farmer.lga} />
          <Row label="Address" value={farmer.address} />
        </div>
        <div className="bg-white rounded-2xl p-4 mb-3">
          <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">Farm Info</p>
          <Row label="Primary Crop" value={farmer.primaryCrop} />
          <Row label="Farm Size" value={farmer.farmSize} />
          <Row label="Land Ownership" value={farmer.landOwnership} />
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">Cooperative</p>
          <Row label="Name" value={farmer.cooperative} />
        </div>
        <button onClick={onViewID} className="btn-primary mt-4">View Farmer ID Card</button>
      </div>
      <AgentBottomNav />
    </div>
  );
}

// ── ID Card ────────────────────────────────────────────────
function FarmerIDCard({ farmer, onBack }) {
  const shareViaWhatsApp = () => {
    const msg = `Farmer ID: *${farmer.id}*\nVerify: https://cropex.hashmarcropex.com/verify/${farmer.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const shareViaSMS = () => {
    const msg = `Farmer ID: ${farmer.id}. Verify: https://cropex.hashmarcropex.com/verify/${farmer.id}`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-4">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-5">Farmer ID Card</h1>
        <div className="bg-brand-green rounded-3xl p-5 flex flex-col items-center text-white">
          <div className="self-start mb-4">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by Hashmar Cropex Ltd"
              className="h-8 w-auto object-contain"
              draggable="false"
            />
          </div>
          <img src={farmer.photo} alt={farmer.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 mb-3" />
          <div className="text-center mb-2"><p className="text-white/60 text-xs">Full Name</p><p className="font-display font-bold text-base">{farmer.name}</p></div>
          <div className="text-center mb-2"><p className="text-white/60 text-xs">Farmer ID</p><p className="font-display font-bold text-sm tracking-widest">{farmer.id}</p></div>
          <div className="text-center mb-4"><p className="text-white/60 text-xs">Corporative name</p><p className="font-display font-bold text-sm">{farmer.cooperative}</p></div>
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 grid grid-cols-2 gap-3">
        <button onClick={shareViaWhatsApp}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-sans font-semibold text-sm">
          <MessageCircle size={15} /> WhatsApp
        </button>
        <button onClick={shareViaSMS}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-text-primary text-white font-sans font-semibold text-sm">
          <Smartphone size={15} /> SMS
        </button>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────
export default function AgentSavedFarmers() {
  const [view, setView] = useState("list"); // list | detail | idcard
  const [selected, setSelected] = useState(null);

  if (view === "list") return <FarmersList onSelect={(f) => { setSelected(f); setView("detail"); }} />;
  if (view === "detail") return <FarmerDetail farmer={selected} onBack={() => setView("list")} onViewID={() => setView("idcard")} />;
  if (view === "idcard") return <FarmerIDCard farmer={selected} onBack={() => setView("detail")} />;
  return null;
}

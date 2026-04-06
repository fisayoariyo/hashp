import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, RefreshCw, Search, Share2 } from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { agentData, agentRegisteredFarmers } from "../../mockData/agent";

function FilterPill({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-brand-border rounded-full py-2 pl-4 pr-9 text-xs font-sans text-brand-text-primary"
      >
        {options.map((opt) => (
          <option key={`${opt.value}-${opt.label}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
    </div>
  );
}

function FarmerCard({ farmer, onView }) {
  return (
    <div className="bg-white rounded-2xl p-3 md:p-4 relative">
      {farmer.status === "pending" && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-brand-amber/15 rounded-full px-2 py-1">
          <RefreshCw size={10} className="text-brand-amber" />
          <span className="text-[10px] font-sans font-semibold text-brand-amber">Sync now</span>
        </div>
      )}
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden mb-3">
        <img src={farmer.photo} alt={farmer.name} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-0.5 min-h-[78px]">
        <p className="font-sans text-xs text-brand-text-primary"><span className="text-brand-text-muted">Name : </span>{farmer.name}</p>
        <p className="font-sans text-xs text-brand-text-primary"><span className="text-brand-text-muted">ID : </span>{farmer.id}</p>
        <p className="font-sans text-xs text-brand-text-primary"><span className="text-brand-text-muted">Reg date: </span>{farmer.regDate}</p>
        <p className="font-sans text-xs font-semibold">
          <span className="text-brand-text-muted font-normal">Status : </span>
          <span className={farmer.status === "synced" ? "text-brand-green" : "text-brand-amber"}>
            {farmer.status === "synced" ? "Synced" : "Sync pending"}
          </span>
        </p>
      </div>
      <button onClick={onView} className="w-full mt-3 py-2.5 rounded-xl bg-brand-green text-white font-sans font-semibold text-xs">
        View Details
      </button>
    </div>
  );
}

function FarmersGrid({ farmers, onSelect }) {
  return (
    <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {farmers.map((f) => <FarmerCard key={f.id} farmer={f} onView={() => onSelect(f)} />)}
      {farmers.length === 0 && (
        <div className="col-span-2 md:col-span-3 py-10 text-center font-sans text-sm text-brand-text-muted">
          No farmers found
        </div>
      )}
    </div>
  );
}

function ListScreen({ query, setQuery, statusFilter, setStatusFilter, sortBy, setSortBy, onOpenSearch, onSelect }) {
  const listData = useMemo(() => {
    let arr = [...agentRegisteredFarmers];
    if (statusFilter !== "all") arr = arr.filter((f) => f.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    }
    if (sortBy === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "date-desc") arr.sort((a, b) => b.regDate.localeCompare(a.regDate));
    if (sortBy === "date-asc") arr.sort((a, b) => a.regDate.localeCompare(b.regDate));
    return arr;
  }, [query, statusFilter, sortBy]);

  const HeaderBlock = () => (
    <>
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary mb-1">Registered Farmers</h1>
      <p className="font-sans text-sm text-brand-text-secondary mb-4">View all registered farmers and their sync status.</p>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-brand-green flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">✓</span>
            </div>
            <span className="font-sans text-xs font-semibold text-brand-text-primary">{agentData.completedSync} Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-brand-amber" />
            <span className="font-sans text-xs font-semibold text-brand-text-primary">{agentData.pendingSync} Pending</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-green text-white text-xs font-semibold">
          <RefreshCw size={12} /> Sync now
        </button>
      </div>
      <div className="flex items-center gap-2 mb-4 md:mb-5">
        <div className="flex-1 flex items-center bg-white border border-brand-border rounded-2xl px-3 gap-2">
          <Search size={16} className="text-brand-text-muted" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search farmer by name, farmer ID...." className="flex-1 py-3 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted" />
        </div>
        <button onClick={onOpenSearch} className="px-4 py-3 bg-brand-green rounded-2xl text-white font-sans text-sm font-semibold">Search</button>
      </div>
      <div className="flex gap-2 mb-4 md:mb-5">
        <FilterPill value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: "Status" }, { value: "synced", label: "Synced" }, { value: "pending", label: "Sync pending" }]} />
        <FilterPill value={sortBy} onChange={setSortBy} options={[{ value: "date-desc", label: "Sort by" }, { value: "date-desc", label: "Newest" }, { value: "date-asc", label: "Oldest" }, { value: "name", label: "Name" }]} />
      </div>
    </>
  );

  return (
    <>
      <div className="min-h-dvh bg-brand-bg-page md:hidden">
        <div className="w-full">
          <div className="flex flex-col pb-28 overflow-y-auto scrollbar-hide">
            <div className="px-4 pt-5">
              <HeaderBlock />
            </div>
            <FarmersGrid farmers={listData} onSelect={onSelect} />
          </div>
        </div>
        <AgentBottomNav />
      </div>

      <AgentDesktopShell active="farmers">
        <HeaderBlock />
        <FarmersGrid farmers={listData} onSelect={onSelect} />
      </AgentDesktopShell>
    </>
  );
}

function SearchScreen({ query, setQuery, statusFilter, setStatusFilter, onBack, onSelect }) {
  const results = useMemo(() => {
    let arr = [...agentRegisteredFarmers];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") arr = arr.filter((f) => f.status === statusFilter);
    return arr;
  }, [query, statusFilter]);

  const SearchContent = () => (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-5"><ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span></button>
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary mb-4">Search Farmers</h1>
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="flex-1 flex items-center bg-white border border-brand-border rounded-2xl px-3 gap-2">
          <Search size={16} className="text-brand-text-muted" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search farmer by name, farmer ID...." className="flex-1 py-3 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted" />
        </div>
        <button className="px-4 py-3 bg-brand-green rounded-2xl text-white font-sans text-sm font-semibold">Search</button>
      </div>
      <div className="flex justify-between items-center mb-4 md:mb-5">
        <FilterPill value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: "Status" }, { value: "synced", label: "Synced" }, { value: "pending", label: "Sync pending" }]} />
        <span className="font-sans text-xs text-brand-text-secondary">Search Result ({results.length})</span>
      </div>
      <FarmersGrid farmers={results} onSelect={onSelect} />
    </>
  );

  return (
    <>
      <div className="min-h-dvh bg-brand-bg-page md:hidden">
        <div className="flex-1 pb-28 overflow-y-auto scrollbar-hide px-4 pt-5">
          <SearchContent />
        </div>
        <AgentBottomNav />
      </div>
      <AgentDesktopShell active="farmers">
        <SearchContent />
      </AgentDesktopShell>
    </>
  );
}

function Section({ title, rows }) {
  return (
    <div className="mb-5">
      <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-1.5">
        {rows.map(([label, value]) => (
          <p key={label} className="font-sans text-sm text-brand-text-primary">{label} : <span className="font-semibold">{value || "—"}</span></p>
        ))}
      </div>
    </div>
  );
}

function DetailScreen({ farmer, onBack }) {
  const [tab, setTab] = useState("details");
  const shareId = () => {
    const msg = `Farmer ID: *${farmer.id}*\nName: ${farmer.name}\nVerify: https://cropex.hashmarcropex.com/verify/${farmer.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const content = (
    <>
          <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-4"><ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span></button>
          <div className="flex items-start justify-between mb-4 gap-3">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary mb-0.5">Farmer details</h1>
              <p className="font-sans text-xs text-brand-text-secondary">{farmer.id}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-green text-white text-xs font-semibold">
              <RefreshCw size={12} /> Sync now
            </button>
          </div>
          <div className="bg-white rounded-full p-1 mb-5 flex md:max-w-sm">
            <button onClick={() => setTab("details")} className={`flex-1 py-2 rounded-full text-sm font-sans font-semibold ${tab === "details" ? "bg-brand-green text-white" : "text-brand-text-secondary"}`}>Details</button>
            <button onClick={() => setTab("id")} className={`flex-1 py-2 rounded-full text-sm font-sans font-semibold ${tab === "id" ? "bg-brand-green text-white" : "text-brand-text-secondary"}`}>ID</button>
          </div>
          {tab === "details" ? (
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <Section title="Online synchronization" rows={[["Status", farmer.status === "synced" ? "Synced" : "Sync pending"]]} />
                <Section title="Biometric Information" rows={[["Face", farmer.biometric?.face ? "Captured" : "Not captured"], ["Fingerprint", farmer.biometric?.fingerprint ? "Captured" : "Not captured"]]} />
                <Section title="Personal Information" rows={[["Full Name", farmer.name], ["Phone", farmer.phone], ["Gender", farmer.gender], ["State", farmer.state], ["LGA", farmer.lga], ["Address", farmer.address], ["NIN", farmer.nin]]} />
              </div>
              <div>
                <Section title="Farm Information" rows={[["Primary Crop", farmer.primaryCrop], ["Farm Size", farmer.farmSize], ["Land Ownership", farmer.landOwnership], ["Reg date", farmer.regDate]]} />
                <Section title="Cooperative & Association" rows={[["Name", farmer.cooperative], ["Agent", agentData.fullName]]} />
              </div>
            </div>
          ) : (
            <div className="bg-brand-green rounded-3xl p-5 md:p-8 flex flex-col items-center text-white md:max-w-xl">
              <div className="self-start mb-4">
                <img src="/brand/HFEI_Primary_Logo_White.png" alt="HFEI by Hashmar Cropex Ltd" className="h-8 w-auto object-contain" draggable="false" />
              </div>
              <img src={farmer.photo} alt={farmer.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 mb-3" />
              <div className="text-center mb-2"><p className="text-white/60 text-xs">Full Name</p><p className="font-display font-bold text-base">{farmer.name}</p></div>
              <div className="text-center mb-2"><p className="text-white/60 text-xs">Farmer ID</p><p className="font-display font-bold text-sm tracking-widest">{farmer.id}</p></div>
              <div className="text-center mb-4"><p className="text-white/60 text-xs">Cooperative name</p><p className="font-display font-bold text-sm">{farmer.cooperative}</p></div>
              <div className="w-full h-px bg-white/20 mb-3" />
              <div className="grid grid-cols-2 gap-4 w-full mb-3">
                <div><p className="text-white/60 text-xs">Agent name</p><p className="font-sans font-semibold text-sm">{agentData.fullName}</p></div>
                <div><p className="text-white/60 text-xs">Agent signature</p><p className="font-sans italic text-sm text-white/80">Hashmar</p></div>
              </div>
              <div className="flex items-center justify-center gap-6 w-full">
                <div className="text-center"><p className="text-white/60 text-xs">Issue date</p><p className="font-display font-bold text-sm">20/04/2026</p></div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center"><p className="text-white/60 text-xs">Expiry date</p><p className="font-display font-bold text-sm">20/04/2027</p></div>
              </div>
            </div>
          )}
    </>
  );

  return (
    <>
      <div className="min-h-dvh bg-brand-bg-page md:hidden">
        <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto scrollbar-hide">{content}</div>
      </div>
      <AgentDesktopShell active="farmers">
        {content}
      </AgentDesktopShell>
      {tab === "id" && (
        <div className="fixed bottom-0 left-0 right-0 md:static md:w-full md:max-w-6xl md:mx-auto md:px-6 bg-white md:bg-transparent pt-3 md:pt-4 px-4 pb-6 md:pb-8">
          <button onClick={shareId} className="btn-primary flex items-center justify-center gap-2 md:max-w-xs"><Share2 size={15} /> Share ID</button>
        </div>
      )}
      <div className="md:hidden"><AgentBottomNav /></div>
    </>
  );
}

export default function AgentSavedFarmers() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [lastRootView, setLastRootView] = useState("list");

  const openDetail = (farmer) => {
    setSelected(farmer);
    setLastRootView(view === "detail" ? "list" : view);
    setView("detail");
  };

  if (view === "list") return <ListScreen query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} onOpenSearch={() => setView("search")} onSelect={openDetail} />;
  if (view === "search") return <SearchScreen query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onBack={() => setView("list")} onSelect={openDetail} />;
  if (view === "detail" && selected) return <DetailScreen farmer={selected} onBack={() => setView(lastRootView)} />;
  return null;
}

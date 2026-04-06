import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, CreditCard, RefreshCw, Search, Share2 } from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { agentData } from "../../mockData/agent";
import { useAgentFarmersSync } from "../../hooks/useAgentFarmersSync";
import AgentStatusPanel from "../../components/agent/AgentStatusPanel";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";

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

function FarmerCard({ farmer, onView, onSyncFarmer }) {
  return (
    <div className="bg-white rounded-2xl p-3 md:p-4 relative">
      {farmer.status === "pending" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSyncFarmer(farmer.id);
          }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-brand-amber/20 hover:bg-brand-amber/35 active:scale-[0.98] rounded-full px-2.5 py-1 border border-brand-amber/50 transition-colors"
        >
          <RefreshCw size={10} className="text-brand-amber" />
          <span className="text-[10px] font-sans font-semibold text-brand-amber">Sync now</span>
        </button>
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

function FarmersGrid({ farmers, onSelect, onSyncFarmer }) {
  return (
    <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {farmers.map((f) => (
        <FarmerCard key={f.id} farmer={f} onView={() => onSelect(f)} onSyncFarmer={onSyncFarmer} />
      ))}
      {farmers.length === 0 && (
        <div className="col-span-2 md:col-span-3 py-10 text-center font-sans text-sm text-brand-text-muted">
          No farmers found
        </div>
      )}
    </div>
  );
}

function ListScreen({
  farmers,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onOpenSearch,
  onSelect,
  onSyncFarmer,
  onSyncAll,
  syncing,
  completedCount,
  pendingCount,
}) {
  const listData = useMemo(() => {
    let arr = [...farmers];
    if (statusFilter !== "all") arr = arr.filter((f) => f.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    }
    if (sortBy === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "date-desc") arr.sort((a, b) => b.regDate.localeCompare(a.regDate));
    if (sortBy === "date-asc") arr.sort((a, b) => a.regDate.localeCompare(b.regDate));
    return arr;
  }, [farmers, query, statusFilter, sortBy]);

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
            <span className="font-sans text-xs font-semibold text-brand-text-primary">{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-brand-amber" />
            <span className="font-sans text-xs font-semibold text-brand-text-primary">{pendingCount} Pending</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onSyncAll}
          disabled={syncing || pendingCount === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-green text-white text-xs font-semibold disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} /> Sync now
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
            <FarmersGrid farmers={listData} onSelect={onSelect} onSyncFarmer={onSyncFarmer} />
          </div>
        </div>
        <AgentBottomNav />
      </div>

      <AgentDesktopShell active="farmers">
        <HeaderBlock />
        <FarmersGrid farmers={listData} onSelect={onSelect} onSyncFarmer={onSyncFarmer} />
      </AgentDesktopShell>
    </>
  );
}

function SearchScreen({ farmers, query, setQuery, statusFilter, setStatusFilter, onBack, onSelect, onSyncFarmer }) {
  const results = useMemo(() => {
    let arr = [...farmers];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") arr = arr.filter((f) => f.status === statusFilter);
    return arr;
  }, [farmers, query, statusFilter]);

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
      <FarmersGrid farmers={results} onSelect={onSelect} onSyncFarmer={onSyncFarmer} />
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

function tabBtnClass(active) {
  return `flex-1 min-w-[120px] py-2.5 px-4 rounded-full text-sm font-sans font-semibold transition-all border-2 ${
    active
      ? "bg-brand-green text-white border-brand-green shadow-sm"
      : "bg-white text-brand-text-primary border-brand-border hover:border-brand-green/40 hover:bg-brand-green/5"
  }`;
}

function DetailScreen({ farmer, onBack, onSyncFarmer, syncing }) {
  const [tab, setTab] = useState("details");
  const shareId = () => {
    const msg = `Farmer ID: *${farmer.id}*\nName: ${farmer.name}\nVerify: https://cropex.hashmarcropex.com/verify/${farmer.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const pending = farmer.status === "pending";

  const content = (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-4">
        <ArrowLeft size={18} />
        <span className="font-sans text-sm">Go back</span>
      </button>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary mb-0.5">Farmer details</h1>
          <p className="font-sans text-xs text-brand-text-secondary">{farmer.id}</p>
        </div>
        <button
          type="button"
          onClick={() => onSyncFarmer(farmer.id)}
          disabled={!pending || syncing}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-semibold shrink-0 disabled:opacity-45 disabled:cursor-not-allowed self-start"
        >
          <RefreshCw size={12} className={syncing && pending ? "animate-spin" : ""} />
          {pending ? "Sync now" : "Synced"}
        </button>
      </div>

      <div className="rounded-full bg-gray-100 p-1 mb-4 flex flex-wrap gap-1 md:inline-flex md:max-w-md w-full">
        <button type="button" onClick={() => setTab("details")} className={tabBtnClass(tab === "details")}>
          Details
        </button>
        <button type="button" onClick={() => setTab("id")} className={tabBtnClass(tab === "id")}>
          ID
        </button>
      </div>

      {tab === "details" ? (
        <>
          <button
            type="button"
            onClick={() => setTab("id")}
            className="w-full md:max-w-md mb-6 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-brand-border bg-white hover:border-brand-green hover:bg-brand-green/5 transition-colors text-left shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center shrink-0">
              <CreditCard className="text-brand-green" size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-sm text-brand-text-primary">View digital ID card</p>
              <p className="font-sans text-xs text-brand-text-secondary">Tap to see the farmer&apos;s official ID</p>
            </div>
            <span className="text-brand-text-muted text-sm font-semibold shrink-0">›</span>
          </button>
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
        </>
      ) : (
        <>
          <div className="bg-brand-green rounded-3xl p-5 md:p-8 flex flex-col items-center text-white md:max-w-xl">
            <div className="self-start mb-4">
              <img src="/brand/HFEI_Primary_Logo_White.png" alt="HFEI by Hashmar Cropex Ltd" className="h-8 w-auto object-contain" draggable="false" />
            </div>
            <img src={farmer.photo} alt={farmer.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 mb-3" />
            <div className="text-center mb-2">
              <p className="text-white/60 text-xs">Full Name</p>
              <p className="font-display font-bold text-base">{farmer.name}</p>
            </div>
            <div className="text-center mb-2">
              <p className="text-white/60 text-xs">Farmer ID</p>
              <p className="font-display font-bold text-sm tracking-widest">{farmer.id}</p>
            </div>
            <div className="text-center mb-4">
              <p className="text-white/60 text-xs">Cooperative name</p>
              <p className="font-display font-bold text-sm">{farmer.cooperative}</p>
            </div>
            <div className="w-full h-px bg-white/20 mb-3" />
            <div className="grid grid-cols-2 gap-4 w-full mb-3">
              <div>
                <p className="text-white/60 text-xs">Agent name</p>
                <p className="font-sans font-semibold text-sm">{agentData.fullName}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Agent signature</p>
                <p className="font-sans italic text-sm text-white/80">Hashmar</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 w-full">
              <div className="text-center">
                <p className="text-white/60 text-xs">Issue date</p>
                <p className="font-display font-bold text-sm">20/04/2026</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-white/60 text-xs">Expiry date</p>
                <p className="font-display font-bold text-sm">20/04/2027</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
            <button
              type="button"
              onClick={shareId}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-3xl border-2 border-brand-green text-brand-green font-display font-semibold text-sm hover:bg-brand-green/5 transition-colors"
            >
              <Share2 size={15} /> Share ID
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <div className="min-h-dvh bg-brand-bg-page md:hidden">
        <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">{content}</div>
      </div>
      <AgentDesktopShell active="farmers">{content}</AgentDesktopShell>
      <div className="md:hidden">
        <AgentBottomNav />
      </div>
    </>
  );
}

export default function AgentSavedFarmers() {
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [lastRootView, setLastRootView] = useState("list");

  const { farmers, syncing, syncMessage, syncFarmer, syncAllPending, counts } = useAgentFarmersSync();

  const openDetail = (farmer) => {
    setSelectedId(farmer.id);
    setLastRootView(view === "detail" ? "list" : view);
    setView("detail");
  };

  const selectedFarmer = selectedId ? farmers.find((f) => f.id === selectedId) : null;

  const toast = syncMessage && (
    <div
      role="status"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-2xl bg-white border border-brand-border shadow-lg max-w-[min(90vw,20rem)]"
    >
      <AgentFormFeedback variant="success">{syncMessage}</AgentFormFeedback>
    </div>
  );

  const syncOverlay = syncing && (
    <div className="fixed inset-0 z-[95] bg-black/25 flex items-center justify-center p-4" aria-live="polite">
      <div className="bg-white rounded-2xl border border-brand-border shadow-xl max-w-xs w-full">
        <AgentStatusPanel variant="sync-loading" />
      </div>
    </div>
  );

  if (view === "list") {
    return (
      <>
        {syncOverlay}
        {toast}
        <ListScreen
          farmers={farmers}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenSearch={() => setView("search")}
          onSelect={openDetail}
          onSyncFarmer={syncFarmer}
          onSyncAll={syncAllPending}
          syncing={syncing}
          completedCount={counts.completed}
          pendingCount={counts.pending}
        />
      </>
    );
  }
  if (view === "search") {
    return (
      <>
        {syncOverlay}
        {toast}
        <SearchScreen
          farmers={farmers}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onBack={() => setView("list")}
          onSelect={openDetail}
          onSyncFarmer={syncFarmer}
        />
      </>
    );
  }
  if (view === "detail" && selectedFarmer) {
    return (
      <>
        {syncOverlay}
        {toast}
        <DetailScreen
          farmer={selectedFarmer}
          onBack={() => setView(lastRootView)}
          onSyncFarmer={syncFarmer}
          syncing={syncing}
        />
      </>
    );
  }
  return null;
}

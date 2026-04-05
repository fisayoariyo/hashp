import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, User } from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import { farmerData } from "../../mockData/farmer";

function MobileBottomNav() {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-4 py-2">
        {[
          { label: "Home", Icon: Home, path: "/farmer/home", active: false },
          { label: "My profile", Icon: User, path: "/farmer/profile", active: true },
        ].map(({ label, Icon, path, active }) => (
          <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center">
            <div className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${active ? "bg-brand-green" : ""}`}>
              <Icon size={22} strokeWidth={1.8} className={active ? "text-white" : "text-brand-green"} />
              <span className={`text-xs font-sans font-medium ${active ? "text-white" : "text-brand-text-secondary"}`}>{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <p className="font-sans text-sm text-brand-text-primary py-1.5 border-b border-brand-border last:border-0">
      {label} : <span className="font-semibold">{value || "—"}</span>
    </p>
  );
}

function Section({ title, rows }) {
  return (
    <div className="mb-5">
      <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">{title}</p>
      {rows.map(([l, v]) => <Row key={l} label={l} value={v} />)}
    </div>
  );
}

function ProfileContent() {
  return (
    <>
      <Section title="Biometric Information" rows={[["Fingerprint", "Captured"], ["Face", "Captured"]]} />
      <Section title="Personal Information" rows={[
        ["Full Name", farmerData.name],
        ["Date of Birth", "12 March 1985"],
        ["Gender", farmerData.gender],
        ["Phone Number", farmerData.phone],
        ["Address", farmerData.address],
        ["NIN", "XXXXXXXXXXXXX"],
      ]} />
      <Section title="Farm Information" rows={[
        ["Farm Size", farmerData.farmSize],
        ["Crop Type", farmerData.primaryCrop],
        ["Land Ownership", farmerData.landOwnershipType],
      ]} />
      <Section title="Cooperative & Association" rows={[
        ["Cooperative Name", farmerData.cooperative],
        ["Registration Number", farmerData.cooperativeRegNo],
        ["Membership Role", farmerData.cooperativeRole],
        ["LGA", farmerData.lga],
        ["Commodity Focus", "Maize, Cassava"],
        ["Cooperative Size", "120 members"],
        ["Land Ownership Type", farmerData.landOwnershipType],
        ["Farm Size (Hectares)", farmerData.farmSize],
        ["Input Supplier", "AgroPlus Nigeria"],
      ]} />
    </>
  );
}

export default function FarmerProfile() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── MOBILE ───────────────────────────────────── */}
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
          <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Your profile</h1>
          <p className="font-sans text-xs text-brand-text-secondary mb-5">
            If you notice any mistake in your details, please contact your agent to make corrections.
          </p>
          <ProfileContent />
        </div>
        <MobileBottomNav />
      </div>

      {/* ── DESKTOP (FWDHP03) ────────────────────────── */}
      <FarmerDesktopLayout activeNav="Profile">
        <button onClick={() => navigate("/farmer/home")}
          className="flex items-center gap-2 text-brand-text-secondary mb-4 hover:text-brand-text-primary transition-colors">
          <ArrowLeft size={16} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Your profile</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-6">
          If you notice any mistake in your details, please contact your agent to make corrections.
        </p>
        <div className="max-w-lg">
          <ProfileContent />
        </div>
      </FarmerDesktopLayout>
    </>
  );
}

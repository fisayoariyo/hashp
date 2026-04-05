import { useNavigate } from "react-router-dom";
import { Home, User } from "lucide-react";
import { farmerData } from "../../mockData/farmer";

function BottomNav({ active }) {
  const navigate = useNavigate();
  const tabs = [
    { label: "Home", icon: <Home size={22} strokeWidth={1.8} />, path: "/farmer/home" },
    { label: "My profile", icon: <User size={22} strokeWidth={1.8} />, path: "/farmer/profile" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-4 py-2">
        {tabs.map(({ label, icon, path }) => {
          const isActive = active === label;
          return (
            <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center">
              <div className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${isActive ? "bg-brand-green" : ""}`}>
                <span className={isActive ? "text-white" : "text-brand-green"}>{icon}</span>
                <span className={`text-xs font-sans font-medium ${isActive ? "text-white" : "text-brand-text-secondary"}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, rows }) {
  return (
    <div className="mb-5">
      <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-1.5">
        {rows.map(([label, value]) => (
          <p key={label} className="font-sans text-sm text-brand-text-primary">
            {label} :{" "}
            <span className="font-semibold">{value || "—"}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function FarmerProfile() {
  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Your profile</h1>
        <p className="font-sans text-xs text-brand-text-secondary mb-5">
          If you notice any mistake in your details, please contact your agent to make corrections.
        </p>

        <Section title="Biometric Information" rows={[
          ["Fingerprint", "Captured"],
          ["Face", "Captured"],
        ]} />

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
      </div>
      <BottomNav active="My profile" />
    </div>
  );
}

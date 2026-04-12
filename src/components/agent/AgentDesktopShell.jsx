import { ChevronDown, Headset, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { agentData } from "../../mockData/agent";

// ── Custom sidebar icon assets ────────────────────────────
import homeIcon    from "../../assets/comps/home-11.svg";
import tractorIcon from "../../assets/comps/tractor.svg";
import settingIcon from "../../assets/comps/settings-03.svg";

const NAV_LINKS = [
  { key: "dashboard", label: "Dashboard",    icon: homeIcon,    path: "/agent/home"           },
  { key: "farmers",   label: "Farmers",       icon: tractorIcon, path: "/agent/saved-farmers"  },
  { key: "settings",  label: "Settings",      icon: settingIcon, path: "/agent/settings"       },
  { key: "support",   label: "Help & Support", icon: null,        path: "/agent/contact-support" },
];

export default function AgentDesktopShell({ active = "dashboard", isOnline = true, children }) {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex min-h-dvh items-center justify-center bg-brand-bg-page px-4 py-5">
      <div className="h-[832px] w-[1280px] rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex h-full gap-[10px]">
          {/* ── Sidebar (CSS: 295x801) ── */}
          <aside className="h-[801px] w-[295px] shrink-0 rounded-[20px] bg-white px-[29px] py-[31px]">
          <img
            src="/brand/HFEI_Primary_Logo_.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="mb-[60px] h-[34px] w-auto object-contain"
          />
          <nav className="space-y-2">
            {NAV_LINKS.map(({ key, label, icon, path }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`flex h-[45px] w-full items-center gap-[10px] rounded-[10px] px-[14px] text-[15px] leading-[18px] font-normal transition-colors ${
                    isActive
                      ? "bg-[#03624D] text-white shadow-[0_6px_14px_rgba(3,98,77,0.18)]"
                      : "text-[#030F0F]/80 hover:bg-[#03624D]/10 hover:text-[#03624D]"
                  }`}
                >
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      className={`h-[22px] w-[22px] shrink-0 ${isActive ? "brightness-0 invert" : ""}`}
                    />
                  ) : (
                    <Headset size={22} className="shrink-0" />
                  )}
                  {label}
                </button>
              );
            })}
          </nav>
          </aside>

          {/* ── Main area (CSS: 935 content width) ── */}
          <main className="flex w-[935px] min-w-0 flex-col gap-[14px]">
            {/* Header */}
            <div className="flex h-[95px] items-center justify-between rounded-[20px] bg-white px-[26px] py-[15px]">
              <div className="flex items-center gap-6">
                <div className="min-w-0">
                  <h1 className="truncate font-display text-[20px] font-bold leading-6 text-brand-text-primary">
                    Welcome, Agent {agentData.name}
                  </h1>
                  <p className="mt-2 text-[15px] font-light leading-[18px] text-brand-text-secondary">
                    Ready to manage farmer registration and track activities
                  </p>
                </div>
                <div
                  className={`inline-flex h-[21.21px] items-center gap-[3px] rounded-[50.49px] px-[10px] text-[12.12px] font-bold leading-[14px] ${
                    isOnline ? "bg-[#03624D] text-white" : "bg-[#E8ECEB] text-[#445250]"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                  <ChevronDown size={10} strokeWidth={2.4} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/agent/register-farmer")}
                className="inline-flex h-[47px] w-[204px] shrink-0 items-center justify-center gap-2 rounded-[15px] bg-[#03624D] px-[20px] text-[15px] font-medium text-white"
              >
                <Plus size={17} strokeWidth={2.5} />
                Register New Farmer
              </button>
            </div>

            {/* Page content */}
            <div className="h-[696px] rounded-[20px] bg-[#F6F6F6] px-9 py-7">
              <div className="h-full overflow-y-auto pr-1">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

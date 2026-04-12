import { Headset, Plus, Wifi, WifiOff } from "lucide-react";
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
    <div className="hidden md:block min-h-dvh bg-[#f6f6f6] p-4 xl:p-8">
      <div className="relative mx-auto w-full max-w-[1280px] min-h-[832px] rounded-[20px] bg-white">
        <aside className="absolute left-[20px] top-[16px] h-[801px] w-[295px] rounded-[20px] bg-white px-[29px] pt-[31px]">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-[34px] w-auto object-contain"
          />

          <nav className="mt-[60px] space-y-5">
            {NAV_LINKS.map(({ key, label, icon, path }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`flex h-[45px] w-[238px] items-center gap-2.5 rounded-[10px] px-[14px] text-left text-[15px] leading-[18px] ${
                    isActive
                      ? "bg-[#03624D] font-medium text-white"
                      : "bg-transparent font-normal text-[#030F0F] hover:bg-[#03624d0f]"
                  }`}
                >
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      className={`h-[22px] w-[22px] ${isActive ? "brightness-0 invert" : ""}`}
                    />
                  ) : (
                    <Headset size={22} className={isActive ? "text-white" : "text-[#030F0F]"} />
                  )}
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <header className="absolute left-[325px] top-[16px] flex h-[95px] w-[935px] items-center justify-between rounded-[20px] bg-white px-[26px] py-[15px]">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-[20px] font-bold leading-6 text-[#030F0F]">Welcome, Agent {agentData.name}</h1>
              <p className="text-[15px] font-light leading-[18px] text-[#030F0F]">
                Ready to manage farmer registration and track activities
              </p>
            </div>
            <div
              className={`ml-1 inline-flex h-[21px] items-center gap-1 rounded-[50px] px-[10px] text-[12px] font-bold leading-[14px] ${
                isOnline ? "bg-[#03624D] text-white" : "bg-[#e8eceb] text-[#445250]"
              }`}
            >
              {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/agent/register-farmer")}
            className="inline-flex h-[47px] items-center justify-center gap-2 rounded-[15px] bg-[#03624D] px-6 text-[15px] font-medium leading-[18px] text-white"
          >
            <Plus size={17} />
            Register New Farmer
          </button>
        </header>

        <main className="absolute left-[325px] top-[121px] h-[696px] w-[935px] rounded-[20px] bg-[#F6F6F6]">
          {children}
        </main>
      </div>
    </div>
  );
}

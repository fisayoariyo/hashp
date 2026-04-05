import { useNavigate } from "react-router-dom";

// Hashmar CropEx logo SVG — inline so no asset dependency needed
function HCXLogo({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4 L70 21 L70 59 L40 76 L10 59 L10 21 Z" stroke="#155235" strokeWidth="3" fill="none"/>
      <ellipse cx="40" cy="40" rx="14" ry="18" stroke="#155235" strokeWidth="2" fill="none"/>
      <path d="M40 22 Q52 34 40 58" stroke="#155235" strokeWidth="2" fill="none"/>
      <path d="M40 22 Q28 34 40 58" stroke="#155235" strokeWidth="2" fill="none"/>
      <circle cx="56" cy="30" r="3.5" fill="#d4900a"/>
      <path d="M56 30 Q62 25 66 28" stroke="#d4900a" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    /*
     * Outer: full-screen, green mesh background on desktop
     * Inner: centered card, max-w-role (600px), mx-auto
     */
    <div className="
      min-h-dvh w-full flex items-center justify-center
      bg-brand-bg-page
      md:bg-gradient-to-br md:from-brand-green md:via-brand-green-light md:to-brand-green-dark
      px-4 py-8
    ">
      {/* Card */}
      <div className="
        w-full max-w-role
        bg-white rounded-3xl shadow-card-lg
        px-6 py-10
        sm:px-10 sm:py-14
        flex flex-col items-center gap-8
      ">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center gap-3">
          <HCXLogo size={72} />
          <div className="text-center">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-green tracking-wide uppercase leading-tight">
              HASHMAR
            </h1>
            <p className="font-display font-semibold text-sm text-brand-amber tracking-[0.25em] uppercase">
              CROPEX LIMITED
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="font-sans text-base sm:text-lg text-brand-text-secondary text-center leading-relaxed max-w-sm">
          Empowering Farmers, Enabling Growth
        </p>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="font-sans text-xs text-brand-text-muted uppercase tracking-widest">
            Select your role
          </span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Role buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          {/* Farmer */}
          <button
            onClick={() => navigate("/farmer/splash")}
            className="
              flex-1 flex flex-col items-center gap-3
              bg-brand-green text-white
              rounded-2xl px-6 py-6
              hover:bg-brand-green-dark active:scale-[0.97]
              transition-all duration-200 shadow-card
            "
          >
            <span className="text-4xl select-none">🌾</span>
            <div className="text-center">
              <p className="font-display font-bold text-lg leading-tight">I am a Farmer</p>
              <p className="font-sans text-white/75 text-xs mt-1 leading-snug">
                View your digital ID, farms and profile
              </p>
            </div>
          </button>

          {/* Agent */}
          <button
            onClick={() => navigate("/agent/splash")}
            className="
              flex-1 flex flex-col items-center gap-3
              bg-brand-amber text-white
              rounded-2xl px-6 py-6
              hover:brightness-95 active:scale-[0.97]
              transition-all duration-200 shadow-card
            "
          >
            <span className="text-4xl select-none">🪪</span>
            <div className="text-center">
              <p className="font-display font-bold text-lg leading-tight">I am an Agent</p>
              <p className="font-sans text-white/75 text-xs mt-1 leading-snug">
                Register farmers and manage records
              </p>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <p className="font-sans text-xs text-brand-text-muted text-center mt-2">
          Hashmar CropEx Limited · Verified Farmer Identity Platform
        </p>
      </div>
    </div>
  );
}

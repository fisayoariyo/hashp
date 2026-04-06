import { useNavigate } from "react-router-dom";

export default function AgentSplash() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden min-h-dvh flex flex-col md:flex-row bg-white">
      <div className="relative md:w-1/2 min-h-[40vh] md:min-h-dvh bg-black shrink-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80"
          alt="Field agents supporting farmers"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[40vh] md:min-h-dvh p-6 md:p-10 text-white">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-12 md:h-14 w-auto object-contain mb-6"
            draggable="false"
          />
          <h2 className="font-display font-bold text-2xl md:text-4xl leading-tight mb-2">Digitally Onboard Farmers</h2>
          <p className="font-sans text-sm md:text-lg text-white/90 max-w-md">
            Capture farmer information and biometrics to create verified digital identities that can be trusted across the platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 md:py-16">
        <img
          src="/brand/HFEI_Primary_Logo_.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-12 w-auto object-contain mb-6 md:hidden"
          draggable="false"
        />
        <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary text-center mb-2">Get Started</h1>
        <p className="font-sans text-sm text-brand-text-secondary text-center max-w-sm mb-10">
          Tell us how you&apos;ll be using Hashmar. Create a new agent account or sign in if you already have one.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button type="button" onClick={() => navigate("/agent/create-account")} className="btn-primary w-full">
            Create account
          </button>
          <button
            type="button"
            onClick={() => navigate("/agent/login")}
            className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

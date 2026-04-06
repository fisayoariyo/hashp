export default function AgentAuthDesktopLayout({ title, subtitle, children, actions, centerTitle = false, leading = null }) {
  return (
    <div className="hidden md:flex min-h-dvh bg-white px-6 py-8 lg:px-10 lg:py-10 gap-10 lg:gap-14 items-stretch">
      {/* Contained hero card (AWD) — not edge-to-edge half screen */}
      <div className="flex w-full max-w-lg shrink-0 flex-col justify-center">
        <div className="relative w-full min-h-[min(640px,calc(100dvh-5rem))] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=80"
            alt="Farmers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute left-7 right-7 bottom-7 lg:left-8 lg:right-8 lg:bottom-8 text-white">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by Hashmar Cropex Ltd"
              className="h-10 w-auto object-contain mb-4"
              draggable="false"
            />
            <h2 className="font-display font-bold text-4xl xl:text-5xl leading-tight mb-3">Digitally Onboard Farmers</h2>
            <p className="font-sans text-lg xl:text-xl text-white/90 leading-snug">
              Capture farmer information and biometrics to create verified digital identities that can be trusted across the platform.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 min-w-0 max-w-[640px] mx-auto py-6 lg:py-10 pr-2 lg:pr-8 flex flex-col w-full justify-center ${
          centerTitle ? "items-center text-center" : ""
        }`}
      >
        {leading}
        {title ? (
          <h1 className="font-display font-bold text-5xl text-brand-text-primary mb-3">{title}</h1>
        ) : null}
        {subtitle && (
          <p className={`font-sans text-xl text-brand-text-secondary mb-8 ${centerTitle ? "max-w-md" : ""}`}>
            {subtitle}
          </p>
        )}
        <div className={`flex-1 w-full ${centerTitle ? "flex flex-col items-center" : ""}`}>{children}</div>
        {actions && (
          <div className={`pt-6 w-full ${centerTitle ? "flex flex-col items-center max-w-sm" : ""}`}>{actions}</div>
        )}
      </div>
    </div>
  );
}


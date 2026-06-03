const AGENT_AUTH_HERO_IMAGE = "/onboarding/agent-role-hero.png";

export default function AgentAuthDesktopLayout({
  title,
  subtitle,
  children,
  actions,
  centerTitle = false,
  leading = null,
  contentClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  actionsClassName = "",
}) {
  return (
    <div className="hidden md:grid md:grid-cols-2 md:min-h-dvh md:bg-white md:px-6 md:py-6 lg:px-8 lg:py-8 md:gap-6 lg:gap-8 md:items-stretch">
      {/* Left ~50% — agent auth reference style */}
      <div className="flex min-w-0 min-h-0 items-stretch">
        <div className="relative w-full min-h-[calc(100dvh-3rem)] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img
            src={AGENT_AUTH_HERO_IMAGE}
            alt="Field agent in greenhouse"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
          <div className="absolute left-6 right-6 bottom-6 lg:left-8 lg:right-8 lg:bottom-8 text-white">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by HFEI Cropex Ltd"
              className="block h-11 w-auto object-contain mb-4"
              draggable="false"
            />
            <h2 className="font-display font-bold text-4xl xl:text-[2.6rem] leading-[1.12] mb-2 max-w-[38rem] xl:max-w-[44rem]">
              Digitally Onboard Farmers
            </h2>
            <p className="font-sans text-[0.95rem] lg:text-[1.05rem] text-white/90 leading-[1.4] max-w-[40rem] xl:max-w-[46rem]">
              Capture farmer information and biometrics to create verified digital identities that can be trusted across the platform.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`flex min-w-0 flex-col w-full justify-center py-4 lg:py-6 px-2 lg:px-6 max-w-[560px] mx-auto ${
          centerTitle ? "items-center text-center" : "items-stretch text-left"
        } ${contentClassName}`}
      >
        {leading}
        {title ? (
          <h1 className={`auth-desktop-title mb-3 ${titleClassName}`}>{title}</h1>
        ) : null}
        {subtitle && (
          <p
            className={`font-sans text-xl text-brand-text-secondary mb-8 ${
              centerTitle ? "max-w-md" : ""
            } ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        )}
        <div className={`flex-1 w-full ${centerTitle ? "flex flex-col items-center" : "text-left"}`}>{children}</div>
        {actions && (
          <div
            className={`pt-6 w-full ${centerTitle ? "flex flex-col items-center max-w-sm" : "text-left"} ${actionsClassName}`}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}


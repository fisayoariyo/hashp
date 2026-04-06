export default function AgentAuthDesktopLayout({ title, subtitle, children, actions }) {
  return (
    <div className="hidden md:flex min-h-dvh bg-white p-4 gap-8">
      <div className="relative w-[50%] rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=80"
          alt="Farmers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute left-8 right-8 bottom-8 text-white">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-10 w-auto object-contain mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-5xl leading-tight mb-3">Digitally Onboard Farmers</h2>
          <p className="font-sans text-2xl text-white/90 leading-snug">
            Capture farmer information and biometrics to create verified digital identities.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-[640px] mx-auto py-10 pr-8 flex flex-col">
        <h1 className="font-display font-bold text-5xl text-brand-text-primary mb-3">{title}</h1>
        {subtitle && <p className="font-sans text-xl text-brand-text-secondary mb-8">{subtitle}</p>}
        <div className="flex-1">{children}</div>
        {actions && <div className="pt-6">{actions}</div>}
      </div>
    </div>
  );
}

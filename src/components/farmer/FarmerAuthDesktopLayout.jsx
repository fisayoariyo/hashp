export default function FarmerAuthDesktopLayout({
  title,
  subtitle,
  children,
  actions,
  heroImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80",
  heroTitle = "Welcome to your Farmer Profile",
  heroSub = "You now have a digital identity that helps you access support, loans, and better opportunities.",
}) {
  return (
    <div className="hidden md:flex min-h-dvh bg-white px-6 py-8 lg:px-10 lg:py-10 gap-10 lg:gap-14 items-stretch">
      <div className="flex w-full max-w-lg shrink-0 flex-col justify-center">
        <div className="relative w-full min-h-[min(560px,calc(100dvh-5rem))] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute left-7 right-7 bottom-7 lg:left-8 lg:right-8 lg:bottom-8 text-white">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by Hashmar Cropex Ltd"
              className="h-10 w-auto object-contain mb-4"
              draggable="false"
            />
            <h2 className="font-display font-bold text-4xl xl:text-5xl leading-tight mb-3">{heroTitle}</h2>
            <p className="font-sans text-lg xl:text-xl text-white/90 leading-snug">{heroSub}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 max-w-[640px] mx-auto py-6 lg:py-10 pr-2 lg:pr-8 flex flex-col justify-center">
        {title && <h1 className="font-display font-bold text-4xl text-brand-text-primary mb-2">{title}</h1>}
        {subtitle && <p className="font-sans text-lg text-brand-text-secondary mb-8">{subtitle}</p>}
        <div className="flex-1 min-h-0">{children}</div>
        {actions && <div className="pt-6 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

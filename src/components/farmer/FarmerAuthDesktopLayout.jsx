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
    <div className="hidden md:grid md:grid-cols-2 md:min-h-dvh md:bg-white md:px-6 md:py-6 lg:px-8 lg:py-8 md:gap-6 lg:gap-8 md:items-stretch">
      <div className="flex min-w-0 min-h-0 items-stretch">
        <div className="relative w-full min-h-[calc(100dvh-3rem)] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
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
      <div className="flex min-w-0 flex-col justify-center py-4 lg:py-6 px-2 lg:px-6 max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:pr-10">
        {title && <h1 className="font-display font-bold text-4xl text-brand-text-primary mb-2">{title}</h1>}
        {subtitle && <p className="font-sans text-lg text-brand-text-secondary mb-8">{subtitle}</p>}
        <div className="flex-1 min-h-0">{children}</div>
        {actions && <div className="pt-6 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

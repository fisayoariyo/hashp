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
    <div className="hidden md:flex min-h-dvh bg-white p-4 gap-8">
      <div className="relative w-[46%] rounded-3xl overflow-hidden shrink-0 min-h-[560px]">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute left-8 right-8 bottom-8 text-white">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-10 w-auto object-contain mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-4xl leading-tight mb-3">{heroTitle}</h2>
          <p className="font-sans text-xl text-white/90 leading-snug">{heroSub}</p>
        </div>
      </div>
      <div className="flex-1 max-w-[640px] mx-auto py-10 pr-8 flex flex-col justify-center">
        {title && <h1 className="font-display font-bold text-4xl text-brand-text-primary mb-2">{title}</h1>}
        {subtitle && <p className="font-sans text-lg text-brand-text-secondary mb-8">{subtitle}</p>}
        <div className="flex-1 min-h-0">{children}</div>
        {actions && <div className="pt-6 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "/onboarding/farmer-1.jpg",
  "/onboarding/farmer-2.jpg",
  "/onboarding/farmer-3.jpg",
];

/**
 * FarmerAuthDesktopLayout
 * Desktop-only split panel: rotating photo left, form content right.
 * Hidden on mobile — FarmerVerify renders its own mobile layout.
 *
 * Props:
 *   title      – heading shown at top of right panel
 *   subtitle   – small text below title (optional)
 *   children   – form fields / content block
 *   actions    – button row pinned to the bottom of the right panel
 *   fixedImage – override cycling; pin to a specific /onboarding/ path
 */
export default function FarmerAuthDesktopLayout({
  title,
  subtitle,
  children,
  actions,
  fixedImage,
}) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (fixedImage) return;
    const t = setInterval(
      () => setImgIdx((i) => (i + 1) % HERO_IMAGES.length),
      4500
    );
    return () => clearInterval(t);
  }, [fixedImage]);

  const heroSrc = fixedImage ?? HERO_IMAGES[imgIdx];

  return (
    <div className="hidden md:flex min-h-dvh bg-white p-5 lg:p-6 gap-5 lg:gap-6">

      {/* ── LEFT: rotating hero photo card ─────────────────────── */}
      <div className="relative w-[45%] shrink-0 rounded-3xl overflow-hidden">
        {/* photo */}
        <img
          key={heroSrc}
          src={heroSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* bottom-left brand + text */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-10 lg:left-10 lg:right-10">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="Hashmar Cropex"
            className="h-10 w-auto object-contain object-left mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-[1.85rem] lg:text-[2.2rem] text-white leading-tight mb-2">
            Welcome to your Farmer Profile
          </h2>
          <p className="font-sans text-base lg:text-[1.05rem] text-white/85 leading-snug">
            You now have a digital identity that helps you access support,
            loans, and better opportunities.
          </p>
        </div>
      </div>

      {/* ── RIGHT: form panel ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between py-14 lg:py-16 px-6 lg:px-14 xl:px-20">

        {/* top: title + subtitle + children (form) */}
        <div>
          {title && (
            <h1 className="font-display font-bold text-[1.9rem] lg:text-[2.1rem] text-brand-text-primary leading-tight mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-sans text-sm text-brand-text-secondary mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-8">{children}</div>
        </div>

        {/* bottom: action buttons */}
        {actions && <div>{actions}</div>}
      </div>

    </div>
  );
}

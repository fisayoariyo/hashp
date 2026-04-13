import { useState, useEffect } from "react";

// Exactly the 3 images shown in FWD-CA-01 / 02 / 03 (left panel cycles through these)
const HERO_IMAGES = [
  "/onboarding/farmer-1.jpg",   // woman with leaves / basket on head
  "/onboarding/farmer-2.jpg",   // gloved hands pulling plant from soil
  "/onboarding/farmer-3.jpg",   // man walking through corn field
];

/**
 * FarmerAuthDesktopLayout
 *
 * Desktop-only (hidden on mobile). Two-column split:
 *   LEFT  — hero photo card with HFEI logo + tagline. Cycles through 3 images
 *           unless `fixedImage` is provided (used on OTP screen to stop cycling).
 *   RIGHT — title at top, children (form), action buttons pinned to bottom.
 *
 * Props
 *   title       heading on right panel
 *   subtitle    small text below heading (optional)
 *   children    form / content block
 *   actions     button row pinned to bottom of right panel
 *   fixedImage  pin left panel to one specific image path (stops cycling)
 */
export default function FarmerAuthDesktopLayout({
  title,
  subtitle,
  children,
  actions,
  fixedImage,
  centered = false,
}) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    // No cycling when a fixed image is provided (e.g. OTP screen)
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

      {/* ── LEFT: hero photo card ──────────────────────────────── */}
      <div className="relative w-[45%] shrink-0 rounded-3xl overflow-hidden">
        <img
          key={heroSrc}
          src={heroSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* brand block — bottom left */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-10 lg:left-10 lg:right-10">
          {/*
            block + w-auto prevents the inline-baseline white-line artefact.
            max-w-[200px] keeps the container tight around the image so no
            extra transparent space renders as white on dark backgrounds.
          */}
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="block h-10 w-auto max-w-[200px] object-contain object-left mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-[1.85rem] lg:text-[2.1rem] text-white leading-tight mb-2">
            Welcome to your Farmer Profile
          </h2>
          <p className="font-sans text-base lg:text-[1.05rem] text-white/85 leading-snug">
            You now have a digital identity that helps you access support,
            loans, and better opportunities.
          </p>
        </div>
      </div>

      {/* ── RIGHT: form panel ─────────────────────────────────── */}
      {/*
        justify-between keeps title+form at the top and action buttons
        pinned to the bottom — exactly as the designs show.
      */}
      <div className="flex-1 flex flex-col justify-between py-14 lg:py-16 px-6 lg:px-14 xl:px-20">

        {/* top section: heading + optional subtitle + form children */}
        <div className={centered ? "mx-auto w-full max-w-[420px] text-center" : ""}>
          {title && (
            <h1 className="font-display font-bold text-[1.85rem] lg:text-[2rem] text-brand-text-primary leading-tight mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-sans text-sm text-brand-text-secondary mb-6 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className={`mt-8 ${centered ? "text-left" : ""}`}>{children}</div>
        </div>

        {/* bottom section: action buttons */}
        {actions && <div className={centered ? "mx-auto w-full max-w-[420px]" : ""}>{actions}</div>}
      </div>

    </div>
  );
}

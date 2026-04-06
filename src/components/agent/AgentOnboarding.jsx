import { useState, useRef } from "react";
import { agentOnboardingSlides } from "../../mockData/agent";

/**
 * AWM agent onboarding — same pattern as FarmerOnboarding (full-bleed mobile;
 * contained image card + copy column on desktop).
 */
export default function AgentOnboarding({ onDone }) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  const slide = agentOnboardingSlides[idx];
  const isLast = idx === agentOnboardingSlides.length - 1;

  const next = () => {
    if (isLast) onDone();
    else setIdx((i) => i + 1);
  };

  const dots = (
    <div className="flex gap-2 mb-6 md:mb-10">
      {agentOnboardingSlides.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === idx ? "w-8 bg-brand-amber" : "w-2 bg-white/40 md:bg-brand-border"
          }`}
        />
      ))}
    </div>
  );

  const ctaLabel = isLast ? "Get Started" : "Next";

  return (
    <div
      className="min-h-dvh w-full flex flex-col md:flex-row md:items-stretch bg-black md:bg-white md:px-8 md:py-10 lg:px-12 lg:py-12 md:gap-10 lg:gap-14"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx < -50) next();
        else if (dx > 50 && idx > 0) setIdx((i) => i - 1);
        touchX.current = null;
      }}
    >
      <div className="relative w-full min-h-[60vh] md:min-h-0 shrink-0 md:flex md:w-full md:max-w-lg md:flex-col md:justify-center">
        <div className="md:hidden absolute inset-0">
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
        </div>
        <div className="hidden md:block relative w-full h-[min(640px,calc(100dvh-5rem))] min-h-[440px] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/15 to-black/50" />
        </div>

        <div className="md:hidden relative z-10 flex flex-col justify-end min-h-[60vh] px-5 pb-10 pt-20">
          <h2 className="font-display font-bold text-3xl text-white leading-tight mb-2">{slide.title}</h2>
          <p className="font-sans text-sm text-white/80 leading-relaxed mb-6">{slide.sub}</p>
          {dots}
          <button type="button" onClick={next} className="btn-primary">
            {ctaLabel}
          </button>
        </div>
      </div>

      <div className="hidden md:flex flex-1 min-w-0 flex-col justify-center px-4 lg:px-8 py-12 w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none">
        <h2 className="font-display font-bold text-4xl lg:text-5xl text-brand-text-primary leading-tight mb-4">
          {slide.title}
        </h2>
        <p className="font-sans text-lg lg:text-xl text-brand-text-secondary leading-relaxed mb-10 max-w-lg">
          {slide.sub}
        </p>
        {dots}
        <div className="max-w-md w-full">
          <button type="button" onClick={next} className="btn-primary">
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

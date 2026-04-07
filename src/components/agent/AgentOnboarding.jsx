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
    <div className="flex gap-2">
      {agentOnboardingSlides.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= idx ? "w-8 bg-[#00634f]" : "w-8 bg-[#e8efec]"
          }`}
        />
      ))}
    </div>
  );

  const ctaLabel = isLast ? "Get Started" : "Next";

  return (
    <div
      className="min-h-dvh w-full flex flex-col bg-black md:grid md:grid-cols-2 md:min-h-dvh md:bg-white md:px-6 md:py-6 lg:px-8 lg:py-8 md:gap-6 lg:gap-8 md:items-stretch"
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
      <div className="relative w-full min-h-dvh shrink-0 md:h-auto md:min-h-0 md:flex md:min-w-0 md:items-stretch">
        {/* Mobile: strict AWM onboarding layout */}
        <div className="md:hidden w-full h-dvh bg-white px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            {dots}
            {!isLast ? (
              <button
                type="button"
                onClick={onDone}
                className="font-sans text-[#00634f] text-sm font-medium"
              >
                Skip
              </button>
            ) : (
              <span className="w-10" />
            )}
          </div>
          <div className="rounded-[2rem] overflow-hidden mb-5">
            <img
              src={slide.image}
              alt=""
              className="w-full h-[50vh] object-cover"
            />
          </div>
          <h2 className="font-display font-bold text-[2.75rem] leading-[1.05] text-[#005646] mb-3">
            {slide.title}
          </h2>
          <p className="font-sans text-[0.95rem] leading-[1.32] text-[#404040] mb-6">
            {slide.sub}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-auto w-full h-16 rounded-[1.5rem] bg-[#005646] text-white font-sans font-semibold text-2xl"
          >
            {ctaLabel}
          </button>
        </div>

        <div className="hidden md:block relative w-full min-h-[calc(100dvh-3rem)] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/15 to-black/50" />
        </div>
      </div>

      <div className="hidden md:flex min-w-0 flex-col justify-center px-4 lg:px-8 py-8 lg:py-10 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:pr-10">
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

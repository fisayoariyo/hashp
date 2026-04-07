import { useState, useRef } from "react";
import { agentOnboardingSlides } from "../../mockData/agent";

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
    <div className="flex gap-2 items-center">
      {agentOnboardingSlides.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= idx ? "w-8 bg-[#005646]" : "w-4 bg-[#dce8e2]"
          }`}
        />
      ))}
    </div>
  );

  const ctaLabel = isLast ? "Get Started" : "Next";

  return (
    <div
      className="w-full flex flex-col bg-white md:grid md:grid-cols-2 md:bg-white md:px-6 md:py-6 lg:px-8 lg:py-8 md:gap-6 lg:gap-8 md:items-stretch"
      style={{ minHeight: "100dvh" }}
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
      {/* ── MOBILE ── */}
      <div
        className="md:hidden w-full max-w-[480px] mx-auto flex flex-col px-5 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
        style={{ minHeight: "100dvh" }}
      >
        {/* dots + skip row */}
        <div className="flex items-center justify-between mb-6">
          {dots}
          {!isLast ? (
            <button
              type="button"
              onClick={onDone}
              className="font-sans text-[#005646] text-base font-medium"
            >
              Skip
            </button>
          ) : (
            <span className="w-10" />
          )}
        </div>

        {/* image card */}
        <div className="rounded-[1.75rem] overflow-hidden mb-6">
          <img
            src={slide.image}
            alt=""
            className="w-full aspect-[3/4] object-cover object-top"
          />
        </div>

        {/* copy */}
        <h2 className="font-display font-bold text-[1.75rem] leading-[1.2] text-[#005646] mb-3">
          {slide.title}
        </h2>
        <p className="font-sans text-base leading-relaxed text-[#404040]">
          {slide.sub}
        </p>

        {/* CTA — pushed to bottom */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={next}
            className="w-full py-5 rounded-[1.5rem] bg-[#005646] text-white font-sans font-semibold text-lg"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* ── DESKTOP left: full-bleed image card ── */}
      <div className="hidden md:block relative w-full min-h-[calc(100dvh-3rem)] rounded-3xl overflow-hidden border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/15 to-black/50" />
      </div>

      {/* ── DESKTOP right: copy column ── */}
      <div className="hidden md:flex min-w-0 flex-col justify-center px-4 lg:px-8 py-8 lg:py-10 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:pr-10">
        <h2 className="font-display font-bold text-4xl lg:text-5xl text-brand-text-primary leading-tight mb-4">
          {slide.title}
        </h2>
        <p className="font-sans text-lg lg:text-xl text-brand-text-secondary leading-relaxed mb-10 max-w-lg">
          {slide.sub}
        </p>
        {dots}
        <div className="max-w-md w-full mt-10">
          <button type="button" onClick={next} className="btn-primary">
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { farmerOnboardingSlides } from "../../mockData/farmer";

/**
 * FWM farmer onboarding — full-bleed + bottom copy on mobile;
 * split hero + white content column on desktop (FWD).
 */
export default function FarmerOnboarding({ onDone }) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  const slide = farmerOnboardingSlides[idx];
  const isLast = idx === farmerOnboardingSlides.length - 1;

  const next = () => {
    if (isLast) onDone();
    else setIdx((i) => i + 1);
  };

  const dots = (
    <div className="flex gap-2 mb-6 md:mb-10">
      {farmerOnboardingSlides.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === idx ? "w-8 bg-brand-amber" : "w-2 bg-white/40 md:bg-brand-border"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div
      className="min-h-dvh w-full flex flex-col md:flex-row bg-black md:bg-white"
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
      <div className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-dvh shrink-0">
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 md:bg-gradient-to-br md:from-black/45 md:via-black/15 md:to-black/55" />

        <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 px-5 pb-10 pt-20">
          <h2 className="font-display font-bold text-3xl text-white leading-tight mb-2">{slide.title}</h2>
          <p className="font-sans text-sm text-white/80 leading-relaxed mb-6">{slide.sub}</p>
          {dots}
          <button type="button" onClick={next} className="btn-primary">
            {isLast ? "Login" : "Next"}
          </button>
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-20 py-12 w-full md:max-w-xl md:mx-auto lg:mx-0 lg:max-w-none">
        <h2 className="font-display font-bold text-4xl lg:text-5xl text-brand-text-primary leading-tight mb-4">
          {slide.title}
        </h2>
        <p className="font-sans text-lg lg:text-xl text-brand-text-secondary leading-relaxed mb-10 max-w-lg">
          {slide.sub}
        </p>
        {dots}
        <div className="max-w-md w-full">
          <button type="button" onClick={next} className="btn-primary">
            {isLast ? "Login" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

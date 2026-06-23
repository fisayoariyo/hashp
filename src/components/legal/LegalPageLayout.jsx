import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import LandingFooter from "../landing/LandingFooter";
import LegalHeroHeader from "./LegalHeroHeader";

function LegalSection({ section }) {
  return (
    <section id={section.id} className="scroll-mt-28 desktop:scroll-mt-32">
      <h3 className="text-[18px] font-bold leading-[1.35] text-landing-black desktop:text-[22px]">
        {section.title}
      </h3>
      <div className="mt-3 space-y-4 text-[14px] leading-[1.65] text-landing-black/90 desktop:mt-4 desktop:text-[16px] desktop:leading-[1.7]">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {section.list ? (
          <ul className="list-disc space-y-2 pl-5">
            {section.list.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default function LegalPageLayout({ page }) {
  const [activeSectionId, setActiveSectionId] = useState(page.sections[0]?.id ?? "");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = `${page.title} | HFEI`;
    return () => {
      document.title = "HFEI";
    };
  }, [page.title]);

  useEffect(() => {
    const sectionElements = page.sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!sectionElements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [page.sections]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(sectionId);
    }
  };

  return (
    <div className="landing-shell min-h-dvh bg-white">
      <div className="desktop:landing-max desktop:px-[100px] desktop:pt-9">
        <section className="relative min-h-[62dvh] overflow-hidden desktop:min-h-[500px] desktop:rounded-[28px]">
          <img
            src="/landing/images/legal-hero-sheep.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/35 desktop:bg-black/45" />
          <div className="relative z-10 flex min-h-[inherit] flex-col">
            <LegalHeroHeader />
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-4 text-center text-white desktop:px-5 desktop:pb-14 desktop:pt-2">
              <h1 className="max-w-4xl text-[26px] font-extrabold leading-[1.2] desktop:text-[44px]">
                {page.title}
              </h1>
              <p className="mt-3 text-[13px] font-normal desktop:text-[16px]">
                Effective Date: {page.effectiveDate}
              </p>
            </div>
          </div>
        </section>
      </div>

      <main className="landing-max px-5 py-8 desktop:px-[100px] desktop:py-14">
        <div className="mx-auto flex max-w-[1180px] flex-col desktop:flex-row desktop:gap-16">
          <aside className="hidden w-[280px] shrink-0 desktop:block">
            <nav aria-label="Table of contents" className="sticky top-8">
              <p className="text-[20px] font-bold text-landing-black">Table of contents</p>
              <ul className="mt-5 flex flex-col gap-1">
                {page.sections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full rounded-[14px] px-4 py-3 text-left text-[16px] leading-[1.35] transition-colors ${
                          isActive
                            ? "bg-landing-green font-medium text-white"
                            : "font-normal text-landing-black hover:text-landing-green"
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <article className="min-w-0 flex-1 desktop:max-w-[760px]">
            <header className="mb-8 desktop:mb-12">
              <h2 className="hidden text-[32px] font-bold leading-[1.25] text-landing-black desktop:block">
                {page.welcomeTitle}
              </h2>
              <div className="space-y-4 text-[14px] leading-[1.65] text-landing-black/90 desktop:mt-5 desktop:text-[16px] desktop:leading-[1.7]">
                {page.welcomeParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </header>

            <div className="space-y-8 desktop:space-y-12">
              {page.sections.map((section) => (
                <LegalSection key={section.id} section={section} />
              ))}
            </div>
          </article>
        </div>
      </main>

      <LandingFooter />

      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-landing-green text-white transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-landing-green/35 desktop:bottom-8 desktop:right-8"
        >
          <ArrowUp size={18} />
        </button>
      ) : null}
    </div>
  );
}

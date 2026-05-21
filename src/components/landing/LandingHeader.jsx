import { useState } from "react";
import { Link } from "react-router-dom";
import { LANDING_NAV_ITEMS } from "../../pages/landing/landingContent";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="landing-max relative px-5 pb-0 pt-7 tablet:px-10 desktop:px-[100px] desktop:pt-[36px]">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" aria-label="HFEI home" className="shrink-0">
          <img
            src="/brand/HFEI_Primary_Logo_.png"
            alt="HFEI"
            className="h-[33px] w-auto tablet:h-[34px]"
          />
        </Link>

        <nav className="hidden rounded-[15px] bg-landing-green px-[30px] py-4 text-white desktop:block">
          <ul className="flex items-center gap-[34px] text-[15px] font-normal">
            {LANDING_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-opacity hover:opacity-80">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/get-started" className="landing-secondary-button hidden desktop:inline-flex">
          Get started
        </Link>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-landing-green desktop:hidden"
        >
          <span className="relative flex h-[15px] w-[19px] flex-col justify-between">
            <span className="block h-[1.8px] w-full rounded-full bg-current" />
            <span className="block h-[1.8px] w-full rounded-full bg-current" />
            <span className="ml-auto block h-[1.8px] w-[13px] rounded-full bg-current" />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <nav className="absolute inset-x-5 top-[78px] z-30 rounded-[18px] border border-landing-green/10 bg-white p-3 shadow-[0_18px_35px_rgba(3,15,15,0.08)] tablet:hidden">
          <ul className="flex flex-col gap-1 text-landing-green">
            {LANDING_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-[12px] px-4 py-3 text-[15px] font-medium transition-colors hover:bg-landing-background"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/get-started"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex h-[49px] items-center justify-center rounded-[15px] bg-landing-green text-[15px] font-medium text-white"
              >
                Get started
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { LANDING_NAV_ITEMS } from "../../pages/landing/landingContent";

const LEGAL_NAV_ITEMS = [{ label: "Home", href: "/" }, ...LANDING_NAV_ITEMS];

function resolveNavHref(href) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export default function LegalHeroHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-20 px-5 pt-7 desktop:px-10 desktop:pt-8">
      <div className="relative flex items-center justify-between gap-4">
        <Link to="/" aria-label="HFEI home" className="shrink-0">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI"
            className="h-[33px] w-auto tablet:h-[34px]"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 desktop:block">
          <ul className="flex items-center gap-[34px] text-[17px] font-normal text-white">
            {LEGAL_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.href === "/" ? (
                  <Link to="/" className="transition-opacity hover:opacity-80">
                    {item.label}
                  </Link>
                ) : (
                  <Link to={resolveNavHref(item.href)} className="transition-opacity hover:opacity-80">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/get-started"
          className="hidden h-[49px] items-center justify-center rounded-[15px] border border-white px-8 text-[15px] font-medium text-white transition-colors hover:bg-white/10 desktop:inline-flex"
        >
          Get started
        </Link>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white desktop:hidden"
        >
          <span className="relative flex h-[15px] w-[19px] flex-col justify-between">
            <span className="block h-[1.8px] w-full rounded-full bg-current" />
            <span className="block h-[1.8px] w-full rounded-full bg-current" />
            <span className="ml-auto block h-[1.8px] w-[13px] rounded-full bg-current" />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <nav className="absolute inset-x-0 top-[62px] z-30 rounded-[18px] border border-white/15 bg-landing-black/90 p-3 backdrop-blur-sm desktop:hidden">
          <ul className="flex flex-col gap-1 text-white">
            {LEGAL_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.href === "/" ? (
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-[12px] px-4 py-3 text-[15px] font-medium transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to={resolveNavHref(item.href)}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-[12px] px-4 py-3 text-[15px] font-medium transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                to="/get-started"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex h-[49px] items-center justify-center rounded-[15px] border border-white text-[15px] font-medium text-white"
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

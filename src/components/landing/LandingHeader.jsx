import { Link } from "react-router-dom";
import { LANDING_NAV_ITEMS } from "../../pages/landing/landingContent";

export default function LandingHeader() {
  return (
    <header className="landing-max px-5 pb-0 pt-6 tablet:px-10 desktop:px-[100px] desktop:pt-[36px]">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" aria-label="HFEI home" className="shrink-0">
          <img
            src="/brand/HFEI_Primary_Logo_.png"
            alt="HFEI"
            className="h-8 w-auto tablet:h-[34px]"
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
      </div>

      <nav className="mt-5 desktop:hidden">
        <ul className="grid grid-cols-3 gap-2 rounded-[15px] bg-landing-green p-2 text-center text-xs text-white tablet:text-sm">
          {LANDING_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block rounded-[10px] px-2 py-3">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

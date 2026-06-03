import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="landing-max relative min-h-[662px] overflow-hidden bg-white desktop:h-[832px]">
      <div className="absolute inset-x-0 bottom-0 h-[432px] overflow-hidden tablet:h-[470px] desktop:h-[832px]">
        <img
          src="/landing/images/hero-landscape.webp"
          srcSet="/landing/images/hero-landscape-mobile.webp 1200w, /landing/images/hero-landscape.webp 2200w"
          sizes="100vw"
          alt="Green farm landscape"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[235px] tablet:h-[320px] desktop:h-[572px]"
          style={{ background: "var(--landing-hero-gradient)" }}
        />
      </div>

      <div className="relative z-10 px-5 pb-[343px] pt-[42px] tablet:px-10 tablet:pb-16 tablet:pt-16 desktop:px-[160px] desktop:pb-0 desktop:pt-[81px]">
        <div className="mx-auto flex max-w-[959px] flex-col items-center text-center">
          <span className="landing-section-label text-[var(--landing-green)]">Welcome to HFEI</span>
          <h1 className="mt-[16px] w-full max-w-[959px] text-[21px] font-extrabold leading-[1.35] text-landing-green min-[420px]:text-[26px] tablet:text-[40px] tablet:leading-[1.4] desktop:text-[45px] desktop:leading-[1.45]">
            <span className="block min-[420px]:whitespace-nowrap">Better Farmers, Better Future.</span>
            <span className="block">Through the use of Technology</span>
          </h1>
          <p className="mt-[14px] max-w-[346px] text-[13px] font-normal leading-[1.28] text-landing-green tablet:mt-[22px] tablet:max-w-[751px] tablet:text-[22px] desktop:text-[25px]">
            HFEI helps field agents register farmers, map farms, and unlock access to financing,
            training, and market opportunities.
          </p>
          <div className="mx-auto mt-[30px] flex w-[85%] max-w-[340px] flex-col items-stretch gap-3 tablet:mt-10 tablet:w-auto tablet:max-w-none tablet:flex-row tablet:items-center tablet:justify-center tablet:gap-4 desktop:mt-[51px]">
            <Link
              to="/get-started"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[14px] bg-landing-green px-6 text-[17px] font-medium text-white shadow-landing-cta transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-landing-green/30 tablet:h-auto tablet:w-[252px] tablet:shrink-0 tablet:rounded-[20px] tablet:px-[32px] tablet:py-[15px] tablet:text-[18px]"
            >
              Sign up
            </Link>
            <Link
              to="/log-in"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[14px] border border-landing-green bg-white px-6 text-[17px] font-medium text-landing-green transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:bg-landing-green hover:text-white focus:outline-none focus:ring-2 focus:ring-landing-green/30 tablet:h-auto tablet:w-[252px] tablet:shrink-0 tablet:rounded-[20px] tablet:px-[32px] tablet:py-[15px] tablet:text-[18px]"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="landing-max relative min-h-[662px] overflow-hidden bg-white desktop:h-[832px]">
      <div className="absolute inset-x-0 bottom-0 h-[432px] overflow-hidden tablet:h-[470px] desktop:h-[832px]">
        <img
          src="/landing/images/hero-landscape.png"
          alt="Green farm landscape"
          className="h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[235px] tablet:h-[320px] desktop:h-[572px]"
          style={{ background: "var(--landing-hero-gradient)" }}
        />
      </div>

      <div className="relative z-10 px-5 pb-[343px] pt-[42px] tablet:px-10 tablet:pb-16 tablet:pt-16 desktop:px-[160px] desktop:pb-0 desktop:pt-[81px]">
        <div className="mx-auto flex max-w-[959px] flex-col items-center text-center">
          <span className="landing-section-label text-[var(--landing-green)]">Welcome to HFEI</span>
          <h1 className="mt-[16px] max-w-[354px] text-[26px] font-extrabold leading-[1.1] text-landing-green tablet:max-w-[959px] tablet:text-[40px] desktop:text-[45px]">
            Empowering Farmers Through Digital Identity and Smart Farm Data
          </h1>
          <p className="mt-[14px] max-w-[346px] text-[13px] font-normal leading-[1.28] text-landing-green tablet:mt-[22px] tablet:max-w-[751px] tablet:text-[22px] desktop:text-[25px]">
            Hashmar helps field agents register farmers, map farms, and unlock access to financing,
            training, and market opportunities.
          </p>
          <Link
            to="/get-started"
            className="mt-[30px] inline-flex h-[52px] w-[276px] items-center justify-center rounded-[14px] bg-landing-green text-[17px] font-medium text-white shadow-landing-cta transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-landing-green/30 tablet:mt-10 tablet:h-auto tablet:w-auto tablet:rounded-[20px] tablet:px-[32px] tablet:py-[15px] tablet:text-[18px] desktop:mt-[51px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

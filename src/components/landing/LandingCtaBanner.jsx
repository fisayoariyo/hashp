import { Link } from "react-router-dom";

export default function LandingCtaBanner() {
  return (
    <section className="landing-max px-5 py-[62px] tablet:px-10 desktop:px-[100px] desktop:py-[104px]">
      <div className="relative min-h-[432px] overflow-hidden rounded-[20px] bg-white">
        <img
          src="/landing/images/hero-landscape.png"
          alt="Green agricultural landscape"
          className="absolute inset-x-0 bottom-0 h-[220px] w-full object-cover object-center tablet:static tablet:h-[420px] desktop:h-[460px]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[232px] tablet:h-[260px] desktop:h-[305px]"
          style={{ background: "var(--landing-hero-gradient)" }}
        />

        <div className="absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-[46px] text-center tablet:px-10 tablet:pt-12 desktop:px-0 desktop:pt-[55px]">
          <h2 className="max-w-[333px] text-[24px] font-extrabold leading-[1.15] text-landing-green tablet:max-w-[624px] tablet:text-[32px] desktop:text-[35px]">
            Empowering Farmers and Field Agents Through Smart Agricultural Technology
          </h2>
          <p className="mt-[17px] max-w-[286px] text-[13px] leading-[1.3] text-landing-green tablet:max-w-[609px] tablet:text-[18px] desktop:mt-[30px] desktop:text-[20px]">
            Start your journey as a farmer or field agent with digital tools designed to drive
            smarter farming and better opportunities.
          </p>
          <Link
            to="/get-started"
            className="mt-[27px] inline-flex h-[50px] w-[236px] items-center justify-center rounded-[14px] bg-landing-green text-[17px] font-medium text-white shadow-landing-cta transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-landing-green/30 tablet:mt-8 tablet:h-auto tablet:w-auto tablet:rounded-[20px] tablet:px-[32px] tablet:py-[15px] tablet:text-[18px] desktop:mt-12"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function LandingCtaBanner() {
  return (
    <section className="landing-max px-5 py-[62px] tablet:px-10 desktop:px-[100px] desktop:py-[104px]">
      <div className="relative min-h-[432px] overflow-hidden rounded-[20px]">
        <img
          src="/landing/images/cta-vegetables.png"
          alt="Fresh vegetables at market"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--landing-overlay)" }}
        />

        <div className="relative flex min-h-[432px] flex-col items-center justify-center px-6 py-12 text-center tablet:min-h-[420px] tablet:px-10 tablet:py-16 desktop:min-h-[460px] desktop:px-0">
          <h2 className="max-w-[min(100%,520px)] text-[24px] font-extrabold leading-[1.35] text-white tablet:max-w-[700px] tablet:text-[32px] tablet:leading-[1.4] desktop:text-[35px] desktop:leading-[1.45]">
            Empowering Farmers and Field Agents
            <br />
            Through Smart Agricultural Technology
          </h2>
          <p className="mt-[17px] max-w-[286px] text-[13px] leading-[1.3] text-white/95 tablet:max-w-[609px] tablet:text-[18px] desktop:mt-[30px] desktop:text-[20px]">
            Start your journey as a farmer or field agent with digital tools designed to drive
            smarter farming and better opportunities.
          </p>
          <Link
            to="/get-started"
            className="mt-[27px] inline-flex h-[50px] w-[236px] items-center justify-center rounded-[14px] bg-landing-green text-[17px] font-medium text-white shadow-landing-cta transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30 tablet:mt-8 tablet:h-auto tablet:w-auto tablet:rounded-[20px] tablet:px-[32px] tablet:py-[15px] tablet:text-[18px] desktop:mt-12"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

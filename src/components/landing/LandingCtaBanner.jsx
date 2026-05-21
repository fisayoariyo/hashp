import { Link } from "react-router-dom";

export default function LandingCtaBanner() {
  return (
    <section className="landing-max px-5 py-16 tablet:px-10 desktop:px-[100px] desktop:py-[104px]">
      <div className="relative overflow-hidden rounded-[20px]">
        <img
          src="/landing/images/hero-landscape.png"
          alt="Green agricultural landscape"
          className="h-[360px] w-full object-cover object-center tablet:h-[420px] desktop:h-[460px]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[220px] tablet:h-[260px] desktop:h-[305px]"
          style={{ background: "var(--landing-hero-gradient)" }}
        />

        <div className="absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-10 text-center tablet:px-10 tablet:pt-12 desktop:px-0 desktop:pt-[55px]">
          <h2 className="max-w-[624px] text-[28px] font-bold leading-[1.15] text-landing-green tablet:text-[32px] desktop:text-[35px]">
            Empowering Farmers and Field Agents Through Smart Agricultural Technology
          </h2>
          <p className="mt-6 max-w-[609px] text-[17px] leading-[1.45] text-landing-green tablet:text-[18px] desktop:mt-[30px] desktop:text-[20px]">
            Start your journey as a farmer or field agent with digital tools designed to drive
            smarter farming and better opportunities.
          </p>
          <Link to="/get-started" className="landing-primary-button mt-8 desktop:mt-12">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

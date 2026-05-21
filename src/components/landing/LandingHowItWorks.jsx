import { Link } from "react-router-dom";
import { LANDING_TABS } from "../../pages/landing/landingContent";

function LandingHowCard({ card }) {
  return (
    <article className="landing-card flex min-h-[280px] flex-col justify-between rounded-[20px] px-4 py-5 tablet:min-h-[310px] tablet:px-[17px] tablet:py-[19px]">
      <div>
        <div className="flex h-[65px] w-[65px] items-center justify-center rounded-[15px] bg-landing-yellow">
          <img src={card.icon} alt="" className="h-[38px] w-[38px]" />
        </div>
        <h3 className="mt-5 text-[18px] font-medium leading-[1.2] text-landing-black tablet:text-[20px]">
          {card.title}
        </h3>
      </div>
      <p className="mt-10 text-[16px] leading-[1.35] text-landing-black tablet:text-[18px]">
        {card.description}
      </p>
    </article>
  );
}

function LandingHowCtaCard({ cta }) {
  return (
    <article className="relative min-h-[280px] overflow-hidden rounded-[15px] tablet:min-h-[310px]">
      <img src={cta.image} alt={cta.alt} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[146px]"
        style={{ background: "var(--landing-image-gradient)" }}
      />
      <div className="absolute inset-x-0 bottom-0 px-[15px] pb-[13px] pt-24 text-center text-white">
        <h3 className="text-[20px] font-bold">{cta.title}</h3>
        <Link
          to={cta.href}
          className="mt-5 flex h-[50px] items-center justify-center rounded-[15px] border border-white bg-black/20 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[3px]"
        >
          Get started
        </Link>
      </div>
    </article>
  );
}

export default function LandingHowItWorks({ activeTab, onTabChange }) {
  const tab = LANDING_TABS[activeTab];

  return (
    <section id="how-it-works" className="bg-landing-background">
      <div className="landing-max px-5 py-16 tablet:px-10 desktop:px-[100px] desktop:py-[75px]">
        <div className="landing-content-max">
          <div className="mx-auto flex max-w-[751px] flex-col items-center text-center">
            <span className="landing-section-label text-landing-green">How HFEI Works</span>
            <h2 className="mt-[15px] text-[28px] font-extrabold leading-[1.15] text-landing-green tablet:text-[32px] desktop:text-[35px]">
              {tab.title}
            </h2>
            <p className="mt-[15px] text-[17px] leading-[1.45] text-landing-green tablet:text-[18px] desktop:text-[20px]">
              {tab.description}
            </p>
          </div>

          <div className="mt-10 flex justify-center tablet:mt-[41px]">
            <div className="inline-flex rounded-[18.635px] bg-white p-2">
              {Object.values(LANDING_TABS).map((item) => {
                const isActive = item.key === activeTab;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onTabChange(item.key)}
                    className={`min-w-[132px] rounded-[12.423px] px-5 py-3 text-[16px] font-medium transition-colors tablet:text-[18.635px] ${
                      isActive
                        ? "bg-landing-green text-white"
                        : "bg-transparent text-landing-green"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-5 tablet:grid-cols-2 desktop:mt-[50px] desktop:grid-cols-3 desktop:gap-x-[19px] desktop:gap-y-[21px]">
            {tab.cards.map((card) => (
              <LandingHowCard key={card.title} card={card} />
            ))}
            <LandingHowCtaCard cta={tab.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}

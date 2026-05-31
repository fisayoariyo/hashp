import { Link } from "react-router-dom";
import { LANDING_TABS } from "../../pages/landing/landingContent";

function LandingHowCard({ card }) {
  return (
    <article className="landing-card flex min-h-[252px] flex-col justify-between rounded-[20px] px-5 py-6 tablet:min-h-[310px] tablet:px-[17px] tablet:py-[19px]">
      <div>
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-landing-yellow tablet:h-[65px] tablet:w-[65px] tablet:rounded-[15px]">
          <img src={card.icon} alt="" className="h-[40px] w-[40px] tablet:h-[38px] tablet:w-[38px]" />
        </div>
        <h3 className="mt-[30px] text-[18px] font-medium leading-[1.2] text-landing-black tablet:mt-5 tablet:text-[20px]">
          {card.title}
        </h3>
      </div>
      <p className="mt-[40px] text-[13px] leading-[1.28] text-landing-black tablet:mt-10 tablet:text-[18px]">
        {card.description}
      </p>
    </article>
  );
}

function LandingHowCtaCard({ cta }) {
  const buttonClass =
    "mt-[18px] flex h-[50px] items-center justify-center rounded-[15px] border border-white bg-black/20 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[3px]";

  const buttonLabel = cta.buttonLabel ?? "Get started";
  const isHashLink = cta.href?.startsWith("#");

  return (
    <article
      key={cta.image}
      className="relative min-h-[344px] overflow-hidden rounded-[20px] tablet:min-h-[310px] tablet:rounded-[15px]"
    >
      <img
        src={cta.image}
        alt={cta.alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: cta.position || "center" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[146px]"
        style={{ background: "var(--landing-image-gradient)" }}
      />
      <div className="absolute inset-x-0 bottom-0 px-4 pb-[13px] pt-24 text-center text-white">
        <h3 className="text-[19px] font-bold tablet:text-[20px]">{cta.title}</h3>
        {isHashLink ? (
          <a href={cta.href} className={buttonClass}>
            {buttonLabel}
          </a>
        ) : (
          <Link to={cta.href} state={cta.returnState} className={buttonClass}>
            {buttonLabel}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function LandingHowItWorks({ activeTab, onTabChange }) {
  const tab = LANDING_TABS[activeTab];

  return (
    <section id="how-it-works" className="bg-landing-background">
      <div className="landing-max px-5 py-[65px] tablet:px-10 desktop:px-[100px] desktop:py-[75px]">
        <div className="landing-content-max">
          <div className="mx-auto flex max-w-[390px] flex-col items-center text-center tablet:max-w-[751px]">
            <span className="landing-section-label text-landing-green">How HFEI Works</span>
            <h2 className="mt-[16px] text-[24px] font-extrabold leading-[1.15] text-landing-green tablet:text-[32px] desktop:text-[35px]">
              {tab.title}
            </h2>
            <p className="mt-[18px] max-w-[380px] text-[13px] leading-[1.45] text-landing-green tablet:mt-[22px] tablet:max-w-[751px] tablet:text-[18px] tablet:leading-[1.5] desktop:text-[20px] desktop:leading-[1.55]">
              {tab.description}
            </p>
          </div>

          <div className="mt-[34px] flex justify-center tablet:mt-[41px]">
            <div className="inline-flex rounded-[18px] bg-white p-[7px] shadow-[0_12px_24px_rgba(3,15,15,0.04)] tablet:rounded-[18.635px] tablet:p-2">
              {Object.values(LANDING_TABS).map((item) => {
                const isActive = item.key === activeTab;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onTabChange(item.key)}
                    className={`min-w-[114px] rounded-[12px] px-5 py-[11px] text-[14px] font-medium transition-colors tablet:min-w-[132px] tablet:rounded-[12.423px] tablet:px-5 tablet:py-3 tablet:text-[18.635px] ${
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

          <div className="mt-[40px] grid gap-5 tablet:grid-cols-2 desktop:mt-[50px] desktop:grid-cols-3 desktop:gap-x-[19px] desktop:gap-y-[21px]">
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

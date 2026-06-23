import { Link } from "react-router-dom";
import { LANDING_FOOTER_GROUPS, LANDING_SOCIAL_LINKS } from "../../pages/landing/landingContent";

function FooterLink({ href, label, linkState }) {
  const isInternal = href.startsWith("/");
  const isAnchor = href.startsWith("#");

  if (isInternal) {
    return (
      <Link to={href} state={linkState} className="transition-opacity hover:opacity-80">
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="transition-opacity hover:opacity-80"
      target={isAnchor ? undefined : "_blank"}
      rel={isAnchor ? undefined : "noreferrer"}
    >
      {label}
    </a>
  );
}

export default function LandingFooter() {
  return (
    <footer className="bg-landing-green text-white">
      <div className="landing-max px-5 py-[34px] tablet:px-10 desktop:px-[100px] desktop:pb-[98px] desktop:pt-[64px]">
        <div className="flex flex-col gap-12 desktop:flex-row desktop:items-start desktop:justify-between desktop:gap-5">
          <div className="max-w-[347px]">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI"
              className="h-[44px] w-auto desktop:h-[51px]"
            />
            <p className="mt-4 max-w-[272px] text-[12px] leading-[1.25] desktop:mt-5 desktop:max-w-none desktop:text-[15px] desktop:leading-[1.35]">
              HFEI empowers farmers with digital identity, data, finance, training, and
              market access.
            </p>
            <p className="mt-[10px] text-[12px] leading-[1.35] desktop:text-[15px]">
              {"\u00A9"}2026 All Rights Reserved.
            </p>

            <div className="mt-[17px] flex items-center gap-[8px]">
              {LANDING_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-[29px] w-[29px] items-center justify-center rounded-[6px] bg-landing-yellow desktop:h-[40.588px] desktop:w-[40.588px] desktop:rounded-[8.118px]"
                  target={item.href === "#" ? undefined : "_blank"}
                  rel={item.href === "#" ? undefined : "noreferrer"}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="h-[17px] w-[17px] desktop:h-[24.353px] desktop:w-[24.353px]"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-[26px] gap-y-[34px] tablet:grid-cols-2 desktop:grid-cols-4 desktop:gap-10">
            {LANDING_FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-[18px] font-medium desktop:text-[20px]">{group.title}</h3>
                <div className="mt-[15px] flex flex-col gap-[16px] text-[14px] font-light leading-[1.12] desktop:mt-[17px] desktop:gap-[19px] desktop:text-[20px]">
                  {group.links.map((link) => (
                    <FooterLink key={link.label} href={link.href} label={link.label} linkState={link.returnState} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

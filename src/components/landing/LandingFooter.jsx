import { Link } from "react-router-dom";
import { LANDING_FOOTER_GROUPS, LANDING_SOCIAL_LINKS } from "../../pages/landing/landingContent";

function FooterLink({ href, label }) {
  const isInternal = href.startsWith("/");
  const isAnchor = href.startsWith("#");

  if (isInternal) {
    return (
      <Link to={href} className="transition-opacity hover:opacity-80">
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
      <div className="landing-max px-5 py-16 tablet:px-10 desktop:px-[100px] desktop:pb-[98px] desktop:pt-[64px]">
        <div className="flex flex-col gap-12 desktop:flex-row desktop:items-start desktop:justify-between desktop:gap-5">
          <div className="max-w-[347px]">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI"
              className="h-[51px] w-auto"
            />
            <p className="mt-5 text-[15px] leading-[1.35]">
              Hashmar empowers farmers with digital identity, data, finance, training, and
              market access.
            </p>
            <p className="mt-[10px] text-[15px] leading-[1.35]">©2026 All Rights Reserved.</p>

            <div className="mt-5 flex items-center gap-[8px]">
              {LANDING_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-[40.588px] w-[40.588px] items-center justify-center rounded-[8.118px] bg-landing-yellow"
                  target={item.href === "#" ? undefined : "_blank"}
                  rel={item.href === "#" ? undefined : "noreferrer"}
                >
                  <img src={item.icon} alt="" className="h-[24.353px] w-[24.353px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 tablet:grid-cols-2 desktop:grid-cols-4 desktop:gap-10">
            {LANDING_FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-[20px] font-medium">{group.title}</h3>
                <div className="mt-[17px] flex flex-col gap-[19px] text-[20px] font-light">
                  {group.links.map((link) => (
                    <FooterLink key={link.label} href={link.href} label={link.label} />
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

import { LANDING_CONTACT } from "../../pages/landing/landingContent";
import StartJourneyLeadForm from "../shared/StartJourneyLeadForm";

export default function LandingContact() {
  return (
    <section
      id={LANDING_CONTACT.sectionId}
      className="landing-max bg-white px-5 py-[57px] tablet:px-10 desktop:px-[100px] desktop:py-[81px]"
    >
      <div className="mx-auto w-full max-w-[390px] text-left tablet:max-w-[560px] desktop:max-w-none">
        <div className="grid w-full gap-10 desktop:grid-cols-2 desktop:items-start desktop:gap-x-[48px] xl:gap-x-[100px]">
          <div className="w-full">
            <span className="landing-section-label justify-start text-landing-green">
              {LANDING_CONTACT.sectionLabel}
            </span>
            <h2 className="mt-[16px] text-[24px] font-extrabold leading-[1.15] text-landing-green tablet:text-[32px] desktop:text-[35px]">
              {LANDING_CONTACT.title}
            </h2>

            <div className="mt-[28px] desktop:mt-[38px]">
              <StartJourneyLeadForm
                idPrefix="landing-contact"
                className="space-y-[24px]"
                submitButtonClassName="!mt-4 !shadow-none"
              />
            </div>
          </div>

          <div className="hidden flex-col gap-8 desktop:flex">
            <p className="text-[20px] font-normal leading-[1.5] text-landing-green">
              {LANDING_CONTACT.description}
            </p>
            <div className="overflow-hidden rounded-[15px]">
              <img
                src={LANDING_CONTACT.image.src}
                alt={LANDING_CONTACT.image.alt}
                className="h-[520px] w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

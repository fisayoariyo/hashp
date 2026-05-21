import { LANDING_ABOUT_IMAGES } from "../../pages/landing/landingContent";

export default function LandingAbout() {
  return (
    <section id="about-hfei" className="bg-landing-green text-white">
      <div className="landing-max px-5 py-16 tablet:px-10 desktop:px-[100px] desktop:pb-[99px] desktop:pt-[81px]">
        <div className="mx-auto flex max-w-[1018px] flex-col items-center text-center">
          <span className="landing-section-label text-white">About HFEI</span>
          <h2 className="mt-[15px] text-[28px] font-medium leading-[1.15] tablet:text-[32px] desktop:text-[35px]">
            About Hashmar Farmer Empowerment Initiative (HFEI)
          </h2>
          <p className="mt-[18px] text-[17px] font-normal leading-[1.5] text-white/95 tablet:text-[18px] desktop:text-[20px] desktop:leading-[30px]">
            The Hashmar Farmer Empowerment Initiative (HFEI) empowers smallholder farmers
            through digital identity, farm data, financial inclusion, and market access. Using
            the Hashmar Agent App and Farmer WebApp, farmers can be registered, mapped,
            monitored, and connected to opportunities like financing, training, insurance, and
            structured markets.
          </p>
        </div>

        <div className="mt-10 grid gap-5 tablet:grid-cols-2 desktop:mt-[43px]">
          {LANDING_ABOUT_IMAGES.map((image) => (
            <div key={image.src} className="overflow-hidden rounded-[15px]">
              <img
                src={image.src}
                alt={image.alt}
                className="h-[260px] w-full object-cover tablet:h-[320px] desktop:h-[394px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

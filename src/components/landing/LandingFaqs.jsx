export default function LandingFaqs({ faqs, openIndex, onToggle }) {
  return (
    <section id="faqs" className="landing-max px-5 pb-16 pt-4 tablet:px-10 desktop:px-[100px] desktop:pb-[108px]">
      <div className="mx-auto flex max-w-[751px] flex-col items-center text-center">
        <span className="landing-section-label text-landing-green">FAQs</span>
        <h2 className="mt-[15px] text-[28px] font-extrabold leading-[1.15] text-landing-green tablet:text-[32px] desktop:text-[35px]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mt-10 grid gap-4 tablet:grid-cols-2 desktop:mt-[59px] desktop:gap-x-12 desktop:gap-y-[30px]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <article key={faq.question} className="landing-faq-item" data-open={isOpen}>
              <button
                type="button"
                onClick={() => onToggle(index)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left desktop:px-[25px] desktop:pb-[15px] desktop:pt-4"
                aria-expanded={isOpen}
              >
                <span className="max-w-[383px] text-[17px] font-medium leading-[1.3] text-landing-black desktop:text-[20px]">
                  {faq.question}
                </span>
                <img
                  src="/landing/icons/plus.svg"
                  alt=""
                  className={`mt-1 h-[34px] w-[34px] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
              {isOpen ? (
                <div className="px-5 pb-5 text-[15px] leading-[1.5] text-landing-black/80 desktop:px-[25px] desktop:text-[18px]">
                  {faq.answer}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

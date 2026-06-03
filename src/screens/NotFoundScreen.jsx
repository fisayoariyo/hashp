import { useNavigate } from "react-router-dom";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#efefef] px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-[760px] flex-col items-center rounded-[18px] bg-[#efefef] px-6 pb-8 pt-6 text-center md:px-10 md:pb-10 md:pt-7">
        <h1 className="font-display text-[44px] font-bold leading-[1.05] text-brand-text-primary md:text-[52px]">
          Page Not Found
        </h1>
        <p className="mt-2 max-w-[430px] font-sans text-[15px] leading-[1.35] text-brand-text-secondary md:text-[16px]">
          Looks like this field hasn't been planted yet.
          <br />
          Let's get you back to familiar ground.
        </p>
        <img
          src="/landing/images/not-found-404.webp"
          alt="Error 404"
          className="mt-7 w-full max-w-[560px] object-contain md:mt-8"
        />
        <div className="mt-auto flex w-full max-w-[420px] flex-col gap-3 pt-8 md:flex-row md:gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="auth-btn-secondary md:h-[56px]"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="btn-primary md:h-[56px]"
        >
          Go to Dashboard
        </button>
        </div>
      </div>
    </div>
  );
}

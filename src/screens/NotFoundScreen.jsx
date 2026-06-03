import { useNavigate } from "react-router-dom";
import errorIllustration from "../assets/comps/badge-error.svg";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#f6f6f6] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[760px] flex-col items-center rounded-[18px] bg-[#efefef] px-6 pb-8 pt-7 text-center md:rounded-[22px] md:px-10 md:pb-10 md:pt-9">
        <h1 className="font-display text-[34px] font-bold leading-tight text-brand-text-primary md:text-[42px]">
          Page Not Found
        </h1>
        <p className="mt-2 max-w-[520px] font-sans text-[14px] leading-relaxed text-brand-text-secondary md:text-[16px]">
          The page you're looking for doesn't exist or may have been moved.
          <br className="hidden md:block" /> Let's get you back on track.
        </p>
        <img
          src={errorIllustration}
          alt="Error 404"
          className="mt-8 w-full max-w-[520px] object-contain md:mt-9"
        />
        <div className="mt-auto flex w-full max-w-[420px] flex-col gap-3 pt-8 md:flex-row md:gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="auth-btn-secondary"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
        </div>
      </div>
    </div>
  );
}

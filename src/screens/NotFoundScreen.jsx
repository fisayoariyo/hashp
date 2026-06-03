import { useNavigate } from "react-router-dom";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-dvh overflow-hidden bg-[#efefef] px-4 py-4 md:px-6 md:py-5">
      <div className="mx-auto flex h-full w-full max-w-[760px] flex-col items-center rounded-[18px] bg-[#efefef] px-6 pb-6 pt-4 text-center md:px-10 md:pb-8 md:pt-5">
        <h1 className="font-display text-[38px] font-bold leading-[1.05] text-brand-text-primary md:text-[48px]">
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
          className="mt-5 h-auto max-h-[50vh] w-full max-w-[560px] object-contain md:mt-6 md:max-h-[52vh]"
        />
        <div className="mt-auto flex w-full max-w-[420px] flex-col gap-3 pt-5 md:flex-row md:gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="auth-btn-secondary md:h-[56px]"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-primary md:h-[56px]"
        >
          Go home
        </button>
        </div>
      </div>
    </div>
  );
}

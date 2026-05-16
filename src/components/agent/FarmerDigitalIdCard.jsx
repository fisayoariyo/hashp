export default function FarmerDigitalIdCard({
  photo,
  name,
  farmerId,
  cooperativeName,
  agentName,
  agentSignature = "Hashmar",
  issueDate,
  expiryDate,
  className = "",
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[34rem] rounded-[2rem] bg-brand-green px-8 py-8 text-white shadow-[0_20px_40px_rgba(4,65,44,0.18)] sm:px-10 sm:py-10 ${className}`.trim()}
    >
      <div className="mb-8 flex justify-center sm:mb-10">
        <img
          src="/brand/HFEI_Primary_Logo_White.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-10 w-auto object-contain sm:h-12"
          draggable="false"
        />
      </div>

      <div className="mb-6 flex justify-center sm:mb-7">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="h-40 w-40 rounded-[1.6rem] border-[4px] border-white/35 object-cover shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-52 sm:w-52"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-[1.6rem] border-[4px] border-white/25 bg-white/10 text-center text-sm font-semibold text-white/80 sm:h-52 sm:w-52">
            No photo
          </div>
        )}
      </div>

      <div className="space-y-5 text-center sm:space-y-6">
        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Full Name</p>
          <p className="mt-2 font-display text-[1.8rem] font-bold leading-tight sm:text-[2.15rem]">
            {name}
          </p>
        </div>

        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Farmer ID</p>
          <p className="mt-2 font-display text-[1.32rem] font-bold tracking-[0.055em] leading-tight break-words sm:text-[1.7rem]">
            {farmerId}
          </p>
        </div>

        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Corporative name</p>
          <p className="mx-auto mt-2 max-w-[24rem] font-display text-[1.45rem] font-semibold leading-tight sm:text-[1.85rem]">
            {cooperativeName}
          </p>
        </div>
      </div>

      <div className="my-7 h-px w-full bg-white/16 sm:my-8" />

      <div className="grid grid-cols-2 gap-6 text-center">
        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Agent name</p>
          <p className="mt-2 font-display text-[1.2rem] font-semibold leading-tight sm:text-[1.5rem]">
            {agentName}
          </p>
        </div>
        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Agent signature</p>
          <p className="mt-2 font-sans text-[1.35rem] italic text-white/90 sm:text-[1.65rem]">
            {agentSignature}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center sm:mt-9">
        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Issue date</p>
          <p className="mt-2 font-display text-[1.35rem] font-bold leading-tight sm:text-[1.65rem]">
            {issueDate}
          </p>
        </div>
        <div className="h-12 w-px bg-white/24 sm:h-14" />
        <div>
          <p className="font-sans text-sm text-white/72 sm:text-[1.02rem]">Expiry date</p>
          <p className="mt-2 font-display text-[1.35rem] font-bold leading-tight sm:text-[1.65rem]">
            {expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}

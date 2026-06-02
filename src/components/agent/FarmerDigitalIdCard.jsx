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
      className={`w-full max-w-[284px] rounded-[22px] bg-brand-green px-4 py-4 text-white shadow-[0_20px_40px_rgba(4,65,44,0.18)] ${className}`.trim()}
    >
      <div className="mb-4 flex justify-center">
        <img
          src="/brand/HFEI_Primary_Logo_White.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-7 w-auto object-contain"
          draggable="false"
        />
      </div>

      <div className="mb-4 flex justify-center">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="h-[116px] w-[116px] rounded-[16px] border-[2.5px] border-white/35 object-cover shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-[1.6rem] border-[4px] border-white/25 bg-white/10 text-center text-sm font-semibold text-white/80 sm:h-52 sm:w-52">
            No photo
          </div>
        )}
      </div>

      <div className="space-y-3 text-center">
        <div>
          <p className="font-sans text-[10px] text-white/72">Full Name</p>
          <p className="mt-1 font-display text-[18px] font-extrabold leading-[110%]">
            {name}
          </p>
        </div>

        <div>
          <p className="font-sans text-[10px] text-white/72">Farmer ID</p>
          <p className="mt-1 font-display text-[15px] font-extrabold tracking-[0.01em] leading-[110%] break-words">
            {farmerId}
          </p>
        </div>

        <div>
          <p className="font-sans text-[10px] text-white/72">Corporative name</p>
          <p className="mx-auto mt-1 max-w-[24rem] font-display text-[14px] font-semibold leading-[120%]">
            {cooperativeName}
          </p>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-white/16 sm:my-5" />

      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="font-sans text-[10px] text-white/72">Agent name</p>
          <p className="mt-1 font-display text-[12px] font-semibold leading-tight">
            {agentName}
          </p>
        </div>
        <div>
          <p className="font-sans text-[10px] text-white/72">Agent signature</p>
          <p className="mt-1 font-sans text-[12px] italic text-white/90">
            {agentSignature}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <div>
          <p className="font-sans text-[10px] text-white/72">Issue date</p>
          <p className="mt-1 font-display text-[12px] font-bold leading-tight">
            {issueDate}
          </p>
        </div>
        <div className="h-8 w-px bg-white/24" />
        <div>
          <p className="font-sans text-[10px] text-white/72">Expiry date</p>
          <p className="mt-1 font-display text-[12px] font-bold leading-tight">
            {expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}

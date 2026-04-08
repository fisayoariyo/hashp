import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { farmerBrandSplash } from "../../mockData/farmer";

/** FWM-CA-01 style — full-bleed field + centered logo (mobile + FWD). */
export default function FarmerSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/farmer/verify", { replace: true }), 2600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black">
      <img
        src={farmerBrandSplash.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6">
        <img
          src="/brand/HFEI_Primary_Logo_White.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="block h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-lg"
          draggable={false}
        />
      </div>
    </div>
  );
}

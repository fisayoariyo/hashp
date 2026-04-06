import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FarmerSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/farmer/verify"), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "100dvh" }}>
      <div className="md:hidden relative w-full h-full bg-black">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-16 w-auto object-contain"
            draggable="false"
          />
        </div>
      </div>
      <div className="hidden md:flex w-full h-full bg-white items-center justify-center">
        <img
          src="/brand/HFEI_Primary_Logo_.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-16 w-auto object-contain"
          draggable="false"
        />
      </div>
    </div>
  );
}

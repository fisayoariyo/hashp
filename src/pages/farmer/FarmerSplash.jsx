import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FarmerSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/farmer/verify"), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-dvh w-full bg-white flex items-center justify-center px-6">
      <img
        src="/brand/HFEI_Primary_Logo_.png"
        alt="HFEI by Hashmar Cropex Ltd"
        className="h-16 sm:h-[4.5rem] w-auto object-contain"
        draggable="false"
      />
    </div>
  );
}

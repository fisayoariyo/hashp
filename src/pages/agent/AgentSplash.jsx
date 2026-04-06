import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AgentSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/agent/create-account"), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative w-full max-w-mobile mx-auto overflow-hidden bg-black" style={{ height: "100dvh" }}>
      <img
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
        alt="Farm"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
        <img
          src="/brand/Submark_3D_.png"
          alt="HFEI"
          className="w-44 drop-shadow-2xl"
          draggable="false"
        />
        <img
          src="/brand/HFEI_Primary_Logo_White.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-12 w-auto object-contain drop-shadow-lg"
          draggable="false"
        />
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FarmerSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/farmer/verify"), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-dvh w-full max-w-mobile mx-auto overflow-hidden bg-black">
      <img
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
        alt="Farm"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
        <div className="w-20 h-20 flex items-center justify-center border-2 border-white/60 rounded-2xl bg-white/10 backdrop-blur-sm">
          <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
            <path d="M32 6 L56 20 L56 44 L32 58 L8 44 L8 20 Z" stroke="white" strokeWidth="2.5" fill="none"/>
            <ellipse cx="32" cy="32" rx="11" ry="14" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M32 18 Q40 28 32 46" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M32 18 Q24 28 32 46" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="44" cy="22" r="3" fill="#d4900a"/>
          </svg>
        </div>
        <div className="text-center">
          <h1 className="font-display font-black text-4xl text-white tracking-widest uppercase">HASHMAR</h1>
          <p className="font-display font-light text-white/80 text-sm tracking-[0.35em] uppercase mt-1">CROPEX LIMITED</p>
        </div>
      </div>
    </div>
  );
}

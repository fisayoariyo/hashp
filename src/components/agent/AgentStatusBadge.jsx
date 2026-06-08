import { X } from "lucide-react";

/**
 * Status seal used on agent account outcome screens (pending / verified / failed).
 */
export default function AgentStatusBadge({ variant = "pending", className = "", size = 160 }) {
  if (variant === "pending") {
    return (
      <div className={`flex items-center justify-center ${className}`} aria-hidden>
        <img
          src="/brand/badge-pending.png"
          alt="Pending verification badge"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          draggable="false"
        />
      </div>
    );
  }

  if (variant === "verified") {
    return (
      <div className={`w-36 h-36 rounded-full flex items-center justify-center bg-brand-green/15 shadow-inner ${className}`} aria-hidden>
        <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20">
          <polyline points="12,34 26,48 52,20" stroke="#03624D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-36 h-36 rounded-full flex items-center justify-center bg-red-500 ${className}`} aria-hidden>
      <X className="w-16 h-16 text-white" strokeWidth={2.5} />
    </div>
  );
}

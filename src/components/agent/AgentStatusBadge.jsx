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
      <div className={`flex items-center justify-center ${className}`} aria-hidden>
        <img
          src="/brand/badge-verified.png"
          alt="Verified account badge"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          draggable="false"
        />
      </div>
    );
  }

  return (
    <div className={`w-36 h-36 rounded-full flex items-center justify-center bg-red-500 ${className}`} aria-hidden>
      <X className="w-16 h-16 text-white" strokeWidth={2.5} />
    </div>
  );
}

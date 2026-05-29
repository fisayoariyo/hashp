import { BadgeCheck, X } from "lucide-react";

const VARIANTS = {
  pending: {
    ring: "bg-brand-amber/20",
    icon: BadgeCheck,
    iconClass: "text-brand-amber",
    strokeWidth: 1.5,
  },
  verified: {
    ring: "bg-brand-green/15 shadow-inner",
    icon: BadgeCheck,
    iconClass: "text-brand-green",
    strokeWidth: 2,
  },
  error: {
    ring: "bg-red-500",
    icon: X,
    iconClass: "text-white",
    strokeWidth: 2.5,
  },
};

/**
 * Status seal used on agent account outcome screens (pending / verified / failed).
 */
export default function AgentStatusBadge({ variant = "pending", className = "" }) {
  const config = VARIANTS[variant] || VARIANTS.pending;
  const Icon = config.icon;

  return (
    <div
      className={`w-28 h-28 rounded-full flex items-center justify-center ${config.ring} ${className}`}
      aria-hidden
    >
      <Icon className={`w-16 h-16 ${config.iconClass}`} strokeWidth={config.strokeWidth} />
    </div>
  );
}

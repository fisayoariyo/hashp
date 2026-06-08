import { X } from "lucide-react";

function ScallopedAmberBadge({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* outer scalloped ring */}
      <path
        d="M80 6 C84 6 87 3 91 3.5 C95 4 97 8 101 9 C105 10 108 8 111 9.5 C114 11 114 15 116.5 17.5 C119 20 123 20 124.5 23 C126 26 124 30 125 33 C126 36 130 37.5 130.5 41 C131 44.5 128.5 47 128.5 50.5 C128.5 54 131 57 130.5 60.5 C130 64 127 65.5 126.5 69 C126 72.5 128 76 126 79 C124 82 120 81.5 117.5 84 C115 86.5 116 90.5 113 92.5 C110 94.5 106.5 92.5 103.5 94.5 C100.5 96.5 99.5 101 96.5 102 C93.5 103 90 101 87 101.5 C84 102 82.5 106 80 106 C77.5 106 76 102 73 101.5 C70 101 66.5 103 63.5 102 C60.5 101 59.5 96.5 56.5 94.5 C53.5 92.5 50 94.5 47 92.5 C44 90.5 45 86.5 42.5 84 C40 81.5 36 82 34 79 C32 76 34 72.5 33.5 69 C33 65.5 30 64 29.5 60.5 C29 57 31.5 54 31.5 50.5 C31.5 47 29 44.5 29.5 41 C30 37.5 34 36 35 33 C36 30 34 26 35.5 23 C37 20 41 20 43.5 17.5 C46 15 46 11 49 9.5 C52 8 55 10 59 9 C63 8 65 4 69 3.5 C73 3 76 6 80 6Z"
        fill="#D97706"
      />
      {/* inner lighter scalloped fill */}
      <path
        d="M80 12 C83.5 12 86 9.5 89.5 10 C93 10.5 94.5 14 98 15 C101.5 16 104 14 106.5 15.5 C109 17 109 20.5 111 23 C113 25.5 116.5 25.5 118 28.5 C119.5 31.5 118 35 119 38 C120 41 123 42 123.5 45.5 C124 49 121.5 51.5 121.5 55 C121.5 58.5 124 61.5 123.5 65 C123 68.5 120 70 119.5 73.5 C119 77 121 80.5 119 83.5 C117 86.5 113.5 86 111 88.5 C108.5 91 109 95 106 96.5 C103 98 99.5 96.5 97 98 C94.5 99.5 93.5 103.5 90.5 104.5 C87.5 105.5 84.5 103.5 81.5 104 C78.5 104.5 77.5 107.5 75 107 C72.5 106.5 71 103 68 102.5 C65 102 62 104 59 103 C56 102 55 98 52.5 96.5 C50 95 46.5 96.5 44 95 C41.5 93.5 42 90 39.5 88 C37 86 33.5 86.5 31.5 83.5 C29.5 80.5 31.5 77 31 73.5 C30.5 70 27.5 68.5 27 65 C26.5 61.5 29 58.5 29 55 C29 51.5 26.5 49 27 45.5 C27.5 42 30.5 41 31.5 38 C32.5 35 31 31.5 32.5 28.5 C34 25.5 37.5 25.5 39.5 23 C41.5 20.5 41.5 17 44 15.5 C46.5 14 49 16 52.5 15 C56 14 57.5 10.5 61 10 C64.5 9.5 67 12 70 12 C73 12 75.5 9.5 78 9.5 C79 9.5 79.5 12 80 12Z"
        fill="#F59E0B"
      />
      {/* checkmark */}
      <polyline
        points="54,82 71,98 107,62"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Status seal used on agent account outcome screens (pending / verified / failed).
 */
export default function AgentStatusBadge({ variant = "pending", className = "", size = 160 }) {
  if (variant === "pending") {
    return (
      <div className={`flex items-center justify-center ${className}`} aria-hidden>
        <ScallopedAmberBadge size={size} />
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

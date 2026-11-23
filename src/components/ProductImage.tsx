import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

function StudioVectorIllustration({ variant }: { variant: string }) {
  switch (variant) {
    case 'laptop-stand':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="238" rx="115" ry="14" fill="#CBD5E1" opacity="0.55" />
          <path d="M98 222 L292 222 L276 234 L82 234 Z" fill="#94A3B8" />
          <path d="M126 222 L212 96 L232 104 L148 222 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <path d="M196 222 L270 112 L288 120 L218 222 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <path d="M120 144 L290 92 L298 108 L128 160 Z" fill="#F8FAFC" stroke="#475569" strokeWidth="2.5" />
          <rect x="148" y="122" width="110" height="8" rx="4" transform="rotate(-17 148 122)" fill="#2563EB" opacity="0.75" />
        </svg>
      );
    case 'water-bottle':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="252" rx="68" ry="12" fill="#CBD5E1" opacity="0.6" />
          <rect x="166" y="64" width="68" height="184" rx="18" fill="#2563EB" />
          <rect x="174" y="64" width="16" height="184" fill="#3B82F6" opacity="0.45" />
          <rect x="176" y="42" width="48" height="26" rx="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <rect x="184" y="34" width="32" height="10" rx="4" fill="#1E293B" />
          <line x1="166" y1="212" x2="234" y2="212" stroke="#DBEAFE" strokeWidth="2" opacity="0.5" />
          <text x="200" y="164" textAnchor="middle" fill="#DBEAFE" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            1000 ML
          </text>
        </svg>
      );
    case 'bedsheet':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="236" rx="135" ry="16" fill="#CBD5E1" opacity="0.55" />
          <rect x="86" y="148" width="228" height="78" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="86" y="170" width="228" height="14" fill="#DBEAFE" />
          <rect x="86" y="196" width="228" height="14" fill="#2563EB" opacity="0.2" />
          <rect x="110" y="96" width="180" height="62" rx="14" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
          <path d="M126 112 L274 112" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
          <rect x="140" y="128" width="120" height="14" rx="7" fill="#FFFFFF" opacity="0.85" />
        </svg>
      );
    case 'earphones':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="165" cy="232" rx="70" ry="12" fill="#CBD5E1" opacity="0.6" />
          <ellipse cx="272" cy="228" rx="46" ry="9" fill="#CBD5E1" opacity="0.5" />
          <rect x="116" y="124" width="98" height="102" rx="28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M116 154 L214 154" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="165" cy="182" r="4" fill="#2563EB" />
          <circle cx="254" cy="138" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="247" y="152" width="12" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="294" cy="156" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="287" y="170" width="12" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        </svg>
      );
    case 'storage-organizer':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="242" rx="135" ry="14" fill="#CBD5E1" opacity="0.55" />
          <rect x="76" y="122" width="126" height="108" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <rect x="116" y="166" width="46" height="10" rx="5" fill="#475569" />
          <rect x="208" y="96" width="120" height="134" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <rect x="245" y="154" width="46" height="10" rx="5" fill="#1E293B" />
          <rect x="218" y="106" width="100" height="22" rx="4" fill="#DBEAFE" />
        </svg>
      );
    case 'personal-care':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="242" rx="130" ry="12" fill="#CBD5E1" opacity="0.55" />
          <rect x="88" y="138" width="136" height="94" rx="14" fill="#1E293B" />
          <line x1="94" y1="158" x2="218" y2="158" stroke="#64748B" strokeWidth="3" strokeDasharray="6 4" />
          <rect x="238" y="88" width="48" height="144" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="250" y="70" width="24" height="20" rx="4" fill="#2563EB" />
          <rect x="296" y="120" width="38" height="112" rx="8" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
        </svg>
      );
    case 'towel':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <rect width="400" height="300" fill="#F1F5F9" />
          <ellipse cx="200" cy="240" rx="115" ry="13" fill="#CBD5E1" opacity="0.55" />
          <rect x="108" y="106" width="184" height="54" rx="18" fill="#2563EB" opacity="0.88" />
          <rect x="104" y="150" width="192" height="58" rx="18" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
          <rect x="116" y="192" width="168" height="36" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M276 118 Q298 110 292 136" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (src.startsWith('svg:')) {
    const variant = src.replace('svg:', '');
    return (
      <div className={`w-full h-full bg-[#F1F5F9] overflow-hidden ${className}`}>
        <StudioVectorIllustration variant={variant} />
      </div>
    );
  }

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex flex-col items-center justify-center p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-10 h-10 text-[#64748B] mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-[#475569] line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
    />
  );
}

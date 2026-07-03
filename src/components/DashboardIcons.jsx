import depositIcon from '../assets/depositIcon.png';
import withdrawalIcon from '../assets/withdrawalIcon.png';
import referralIcon from '../assets/referralIcon.png';

const VARIANTS = {
  purple: {
    glass: 'from-purple-500/20 via-violet-600/10 to-purple-900/20',
    border: 'border-purple-400/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]',
    ring: 'ring-purple-500/20',
    accent: '#A855F7',
    accentDark: '#7C3AED',
  },
  orange: {
    glass: 'from-orange-500/20 via-amber-500/10 to-orange-900/20',
    border: 'border-orange-400/30',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]',
    ring: 'ring-orange-500/20',
    accent: '#F97316',
    accentDark: '#EA580C',
  },
  green: {
    glass: 'from-green-500/20 via-emerald-500/10 to-green-900/20',
    border: 'border-green-400/30',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    ring: 'ring-green-500/20',
    accent: '#22C55E',
    accentDark: '#16A34A',
  },
  red: {
    glass: 'from-red-500/20 via-rose-500/10 to-red-900/20',
    border: 'border-red-400/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    ring: 'ring-red-500/20',
    accent: '#EF4444',
    accentDark: '#DC2626',
  },
  gold: {
    glass: 'from-amber-500/20 via-yellow-500/10 to-amber-900/20',
    border: 'border-amber-400/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]',
    ring: 'ring-amber-500/20',
    accent: '#F59E0B',
    accentDark: '#D97706',
  },
  blue: {
    glass: 'from-blue-500/20 via-sky-500/10 to-blue-900/20',
    border: 'border-blue-400/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    ring: 'ring-blue-500/20',
    accent: '#3B82F6',
    accentDark: '#2563EB',
  },
};

const SIZES = {
  sm: { box: 'h-10 w-10 rounded-xl', icon: 'h-5 w-5' },
  md: { box: 'h-12 w-12 rounded-xl', icon: 'h-6 w-6' },
  lg: { box: 'h-14 w-14 rounded-2xl', icon: 'h-7 w-7' },
};

const PNG_SIZES = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
};

function PngIcon({ src, alt, size = 'lg', className = '' }) {
  const s = PNG_SIZES[size] || PNG_SIZES.lg;
  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 object-contain ${s} ${className}`}
      draggable={false}
    />
  );
}

export function GlassNeonIcon({
  variant = 'purple',
  size = 'md',
  className = '',
  children,
  animate = false,
}) {
  const v = VARIANTS[variant] || VARIANTS.purple;
  const s = SIZES[size] || SIZES.md;

  return (
    <div
      className={`
        neon-glass-icon relative flex shrink-0 items-center justify-center
        border bg-gradient-to-br backdrop-blur-md
        ${v.glass} ${v.border} ${v.glow} ${v.ring} ring-1
        ${s.box} ${animate ? 'neon-icon-float' : ''} ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/10 to-transparent" />
      <div className="pointer-events-none absolute -top-px left-3 right-3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── Action Icons ─── */

export function DepositNeonIcon({ size = 'lg', className = '' }) {
  return <PngIcon src={depositIcon} alt="Deposit" size={size} className={className} />;
}

export function WithdrawNeonIcon({ size = 'lg', className = '' }) {
  return <PngIcon src={withdrawalIcon} alt="Withdraw" size={size} className={className} />;
}

export function PendingDepositNeonIcon({ size = 'sm', className = '' }) {
  return <PngIcon src={depositIcon} alt="Pending Deposit" size={size} className={className} />;
}

export function PendingWithdrawNeonIcon({ size = 'sm', className = '' }) {
  return <PngIcon src={withdrawalIcon} alt="Pending Withdraw" size={size} className={className} />;
}

/* ─── Stat Icons ─── */

export function BalanceNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="purple" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <defs>
          <linearGradient id="bal-case" x1="4" y1="8" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C084FC" /><stop offset="1" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <rect x="3" y="8" width="18" height="11" rx="2.5" fill="url(#bal-case)" />
        <path d="M3 12h18" stroke="white" strokeOpacity="0.15" />
        <rect x="8" y="5" width="8" height="4" rx="1.5" fill="#A855F7" />
        <circle cx="15" cy="14" r="2" fill="#EDE9FE" fillOpacity="0.8" />
      </svg>
    </GlassNeonIcon>
  );
}

export function DepositStatNeonIcon({ size = 'sm', className = '' }) {
  return <PngIcon src={depositIcon} alt="Total Deposit" size={size} className={className} />;
}

export function WithdrawStatNeonIcon({ size = 'sm', className = '' }) {
  return <PngIcon src={withdrawalIcon} alt="Total Withdraw" size={size} className={className} />;
}

export function ProfitNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="red" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <defs>
          <linearGradient id="pf-coin" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCA5A5" /><stop offset="1" stopColor="#B91C1C" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="7" fill="url(#pf-coin)" />
        <circle cx="12" cy="12" r="7" stroke="#FECACA" strokeWidth="1" fill="none" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">$</text>
      </svg>
    </GlassNeonIcon>
  );
}

/* ─── Footer / Feature Icons ─── */

export function SecureNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="purple" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <defs>
          <linearGradient id="sec-shield" x1="6" y1="3" x2="18" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C084FC" /><stop offset="1" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <path d="M12 3l7 3v6c0 4.5-3 8.5-7 9-4-.5-7-4.5-7-9V6l7-3z" fill="url(#sec-shield)" />
        <path d="M9.5 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </GlassNeonIcon>
  );
}

export function ProfitsNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="green" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <path d="M5 17l4-5 3 3 5-7" stroke="#86EFAC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 17l4-5 3 3 5-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="blur(2px)" opacity="0.6" />
        <circle cx="17" cy="8" r="2" fill="#4ADE80" />
      </svg>
    </GlassNeonIcon>
  );
}

export function InstantNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="gold" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <defs>
          <linearGradient id="inst-bolt" x1="10" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" /><stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <path d="M13 2L5 13h6l-1 9 9-12h-6l1-8z" fill="url(#inst-bolt)" />
      </svg>
    </GlassNeonIcon>
  );
}

export function SupportNeonIcon({ size = 'sm', className = '' }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <GlassNeonIcon variant="blue" size={size} className={className}>
      <svg viewBox="0 0 24 24" className={`neon-svg-glow ${s.icon}`} fill="none">
        <defs>
          <linearGradient id="sup-head" x1="4" y1="8" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" /><stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <path d="M4 14v-2a8 8 0 0116 0v2" stroke="url(#sup-head)" strokeWidth="2" />
        <rect x="3" y="13" width="3" height="5" rx="1.5" fill="#60A5FA" />
        <rect x="18" y="13" width="3" height="5" rx="1.5" fill="#60A5FA" />
        <path d="M10 18.5a2 2 0 004 0" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </GlassNeonIcon>
  );
}

export function ReferralNeonIcon({ size = 'sm', className = '' }) {
  return <PngIcon src={referralIcon} alt="Referral" size={size} className={className} />;
}

export function GiftNeonIcon({ size = 'md', className = '' }) {
  return <PngIcon src={referralIcon} alt="Refer & Earn" size={size} className={className} />;
}

/* Stat icon map for StatCard */
export const STAT_NEON_ICONS = {
  purple: BalanceNeonIcon,
  green: DepositStatNeonIcon,
  orange: WithdrawStatNeonIcon,
  red: ProfitNeonIcon,
};

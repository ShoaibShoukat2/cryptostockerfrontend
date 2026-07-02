export function IconBox({ children, variant = 'purple', size = 'md', className = '' }) {
  const variants = {
    purple: 'from-cs-purple/30 to-cs-purple-dark/20 border-cs-purple/40 shadow-[0_0_12px_rgba(139,92,246,0.35)]',
    orange: 'from-cs-orange/30 to-cs-gold/20 border-cs-orange/40 shadow-[0_0_12px_rgba(249,115,22,0.35)]',
    green: 'from-cs-green/30 to-cs-green/10 border-cs-green/40 shadow-[0_0_12px_rgba(34,197,94,0.3)]',
    red: 'from-cs-red/30 to-cs-red/10 border-cs-red/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    gold: 'from-cs-gold/30 to-cs-gold/10 border-cs-gold/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    blue: 'from-blue-500/30 to-blue-600/10 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  };

  const sizes = {
    sm: 'h-9 w-9 rounded-lg',
    md: 'h-11 w-11 rounded-xl',
    lg: 'h-14 w-14 rounded-xl',
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center border bg-gradient-to-br ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </div>
  );
}

export function DepositIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
      <rect x="6" y="10" width="20" height="14" rx="3" fill="url(#depGrad)" />
      <path d="M6 14h20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <circle cx="22" cy="19" r="2" fill="white" opacity="0.8" />
      <path d="M16 6v8M13 9l3-3 3 3" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="depGrad" x1="6" y1="10" x2="26" y2="24">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WithdrawIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
      <rect x="6" y="10" width="20" height="14" rx="3" fill="url(#wdGrad)" />
      <path d="M6 14h20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <circle cx="22" cy="19" r="2" fill="white" opacity="0.8" />
      <path d="M16 22v-8M13 19l3 3 3-3" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="wdGrad" x1="6" y1="10" x2="26" y2="24">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PendingDepositIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 3C8.5 3 6 5.5 6 9v1H4v11h16V10h-2V9c0-3.5-2.5-6-6-6z" fill="url(#pdGrad)" />
      <circle cx="12" cy="9" r="2" fill="white" opacity="0.6" />
      <defs>
        <linearGradient id="pdGrad" x1="4" y1="3" x2="20" y2="21">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PendingWithdrawIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="12" cy="12" r="9" stroke="url(#pwGrad)" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="pwGrad" x1="3" y1="3" x2="21" y2="21">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

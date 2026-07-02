import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import NotificationBell from './NotificationBell';

function HeaderIconBtn({ children, onClick, label, variant = 'purple' }) {
  const glow = {
    purple: 'border-purple-500/25 bg-purple-500/10 shadow-[0_0_14px_rgba(168,85,247,0.2)] hover:border-purple-400/40 hover:shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    gold: 'border-amber-500/25 bg-amber-500/10 shadow-[0_0_14px_rgba(245,158,11,0.15)] hover:border-amber-400/40',
  }[variant];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition-all ${glow}`}
    >
      {children}
    </motion.button>
  );
}

export default function Header({ user, notifications = 0 }) {
  const navigate = useNavigate();
  const name = user?.user?.first_name || user?.user?.username || user?.first_name || user?.username || 'User';
  const vipLevel = user?.vip_level || 1;
  const balance = parseFloat(user?.available_balance || 0);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 relative z-[60]"
    >
      <div className="header-glass-bar flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-gradient-to-r from-[#141414]/90 via-[#111111]/95 to-[#141414]/90 px-3 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3">
        {/* Left — greeting */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <motion.button
            type="button"
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative shrink-0"
            aria-label="Open profile"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-900 ring-2 ring-purple-500/30 sm:h-11 sm:w-11"
              style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
            >
              <span className="text-sm font-bold text-white sm:text-base">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-[#111]">
              <Crown size={9} className="text-white" />
            </span>
          </motion.button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                Hi, {name}
              </p>
              <motion.span
                animate={{ rotate: [0, 14, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles size={13} className="text-amber-400" />
              </motion.span>
              <span className="hidden rounded-full bg-gradient-to-r from-purple-600/30 to-amber-500/30 px-2 py-0.5 text-[8px] font-bold text-amber-300 ring-1 ring-amber-500/30 sm:inline">
                VIP {vipLevel}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 sm:text-[11px]">Welcome back · Ready to stack</p>
            {balance > 0 && (
              <p className="mt-0.5 text-[10px] font-semibold text-purple-400 sm:hidden">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 items-center gap-2">
          {balance > 0 && (
            <div className="hidden rounded-xl border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-right sm:block">
              <p className="text-[8px] text-gray-500">Balance</p>
              <p className="text-xs font-bold text-white">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <NotificationBell initialCount={notifications} variant="glass" />

          <HeaderIconBtn label="Profile" onClick={() => navigate('/profile')}>
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none">
              <circle cx="10" cy="7" r="3.5" stroke="#C084FC" strokeWidth="1.5" />
              <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </HeaderIconBtn>
        </div>
      </div>
    </motion.header>
  );
}

export function CountdownTimer({ seconds, showLabels = false }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    setTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (time <= 0) return;
    const interval = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [time]);

  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');

  if (showLabels) {
    const parts = [
      { val: h, label: 'Hrs' },
      { val: m, label: 'Mins' },
      { val: s, label: 'Secs' },
    ];
    return (
      <div className="flex items-center justify-center gap-0.5 font-mono">
        {parts.map((part, i) => (
          <span key={part.label} className="flex items-center gap-0.5">
            {i > 0 && <span className="mb-3 text-sm text-gray-600">:</span>}
            <span className="flex flex-col items-center">
              <span className="text-lg font-bold leading-none text-white sm:text-xl">{part.val}</span>
              <span className="mt-0.5 text-[7px] text-gray-500">{part.label}</span>
            </span>
          </span>
        ))}
      </div>
    );
  }

  const Digit = ({ value }) => (
    <motion.span
      key={value}
      initial={{ y: -4, opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="countdown-digit text-lg font-bold text-white"
    >
      {value}
    </motion.span>
  );

  return (
    <div className="flex items-center gap-0.5 font-mono">
      <Digit value={h} />
      <span className="text-gray-500">:</span>
      <Digit value={m} />
      <span className="text-gray-500">:</span>
      <Digit value={s} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Header({ user, notifications = 0 }) {
  const name = user?.user?.first_name || user?.user?.username || user?.first_name || user?.username || 'User';

  return (
    <header className="mb-4">
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <NotificationBell initialCount={notifications} />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cs-purple to-cs-purple-dark ring-1 ring-cs-purple/30 sm:h-9 sm:w-9"
          style={{ boxShadow: '0 0 12px rgba(139,92,246,0.35)' }}
        >
          <User size={15} />
        </motion.div>
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold">Hi, {name} 👋</p>
          <p className="text-[9px] text-gray-500">Welcome Back!</p>
        </div>
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-full bg-gradient-to-r from-cs-purple to-cs-gold px-2 py-0.5 text-[9px] font-bold"
        >
          VIP {user?.vip_level || 1}
        </motion.span>
      </div>
    </header>
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

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Logo } from './Logo';
import NotificationBell from './NotificationBell';

export default function Header({ user, notifications = 0 }) {
  const name = user?.user?.first_name || user?.user?.username || user?.first_name || user?.username || 'User';

  return (
    <header className="mb-5">
      <div className="mb-3 flex items-center justify-end gap-2 sm:gap-3">
        <NotificationBell initialCount={notifications} />
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cs-purple to-cs-purple-dark ring-2 ring-cs-purple/30"
            style={{ boxShadow: '0 0 15px rgba(139,92,246,0.4)' }}
          >
            <User size={16} />
          </motion.div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold">Hi, {name} 👋</p>
            <p className="text-[9px] text-gray-500">Welcome Back!</p>
          </div>
        </div>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-full bg-gradient-to-r from-cs-purple via-cs-purple-neon to-cs-gold px-2.5 py-0.5 text-[9px] font-bold shadow-lg"
          style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}
        >
          VIP {user?.vip_level || 1}
        </motion.span>
      </div>

      <Logo size="md" centered showTagline />
    </header>
  );
}

export function CountdownTimer({ seconds }) {
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

  const Digit = ({ value }) => (
    <motion.span
      key={value}
      initial={{ y: -4, opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="countdown-digit text-lg font-bold text-cs-gold"
    >
      {value}
    </motion.span>
  );

  return (
    <div className="flex items-center gap-0.5 font-mono">
      <Digit value={h} />
      <span className="text-cs-gold/60">:</span>
      <Digit value={m} />
      <span className="text-cs-gold/60">:</span>
      <Digit value={s} />
    </div>
  );
}

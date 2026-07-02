import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Logo } from './Logo';
import NotificationBell from './NotificationBell';

export default function Header({ user, notifications = 0 }) {
  const name = user?.user?.first_name || user?.user?.username || 'User';

  return (
    <header className="mb-4 flex items-center justify-between gap-2">
      <Logo size="sm" />
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell initialCount={notifications} />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cs-purple to-cs-purple-dark">
            <User size={16} />
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold">Hi, {name} 👋</p>
            <p className="text-[9px] text-gray-500">Welcome Back!</p>
          </div>
        </div>
        <span className="rounded-full bg-gradient-to-r from-cs-purple to-cs-gold px-2 py-0.5 text-[9px] font-bold">
          VIP {user?.vip_level || 1}
        </span>
      </div>
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

  return (
    <span className="font-mono text-lg font-bold text-cs-gold">{h}:{m}:{s}</span>
  );
}

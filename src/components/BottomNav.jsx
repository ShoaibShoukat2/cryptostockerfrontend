import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, User } from 'lucide-react';
import { depositIconPng, withdrawIconPng, referralIconPng } from './DashboardIcons';

const navItems = [
  { path: '/dashboard', type: 'lucide', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/deposit', type: 'img', src: depositIconPng, label: 'Deposit' },
  { path: '/withdraw', type: 'img', src: withdrawIconPng, label: 'Withdraw' },
  { path: '/team', type: 'img', src: referralIconPng, label: 'Team' },
  { path: '/transactions', type: 'lucide', icon: Receipt, label: 'Transactions' },
  { path: '/profile', type: 'lucide', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {navItems.map(({ path, type, icon: Icon, src, label }) => {
          const active = location.pathname === path;
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition-colors ${
                active ? 'text-cs-purple' : 'text-gray-500 hover:text-gray-300'
              } ${active ? 'nav-active-glow' : ''}`}
            >
              {active && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-xl bg-cs-purple/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {type === 'img' ? (
                <img
                  src={src}
                  alt={label}
                  className={`relative z-10 h-6 w-6 object-contain ${active ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.9)]' : ''}`}
                  draggable={false}
                />
              ) : (
                <Icon
                  size={20}
                  className={`relative z-10 ${active ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.9)]' : ''}`}
                />
              )}
              <span className={`relative z-10 text-[9px] font-medium ${active ? 'font-bold' : ''}`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

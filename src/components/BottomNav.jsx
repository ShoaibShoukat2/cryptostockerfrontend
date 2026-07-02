import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Users, Receipt, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/deposit', icon: ArrowDownToLine, label: 'Deposit' },
  { path: '/withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
  { path: '/team', icon: Users, label: 'Team' },
  { path: '/transactions', icon: Receipt, label: 'Transactions' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cs-dark/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
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
              <Icon
                size={20}
                className={`relative z-10 ${active ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.9)]' : ''}`}
              />
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

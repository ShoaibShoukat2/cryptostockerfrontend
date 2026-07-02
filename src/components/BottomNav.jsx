import { useNavigate, useLocation } from 'react-router-dom';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cs-dark/95 backdrop-blur-lg border-t border-cs-border">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                active ? 'text-cs-purple' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''} />
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

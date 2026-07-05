import { useEffect } from 'react';
import { LogOut, User, Mail, Shield, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />

        <div className="card-dark glow-purple mb-4 p-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cs-purple to-cs-gold">
            <User size={36} />
          </div>
          <h2 className="text-xl font-bold">
            {user?.user?.first_name} {user?.user?.last_name}
          </h2>
          <p className="text-sm text-gray-500">@{user?.user?.username}</p>
          <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-cs-purple to-cs-gold px-3 py-1 text-xs font-bold">
            VIP {user?.vip_level || 1}
          </span>
        </div>

        <div className="card-dark mb-4 grid grid-cols-2 gap-3 p-4">
          {[
            { label: 'Total Balance', value: `$${parseFloat(user?.total_balance || 0).toFixed(2)}`, color: 'text-cs-purple' },
            { label: 'Total Profit', value: `$${parseFloat(user?.total_profit || 0).toFixed(2)}`, color: 'text-cs-gold' },
            { label: 'Total Deposit', value: `$${parseFloat(user?.total_deposit || 0).toFixed(2)}`, color: 'text-cs-green' },
            { label: 'Total Withdraw', value: `$${parseFloat(user?.total_withdraw || 0).toFixed(2)}`, color: 'text-cs-orange' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="card-dark mb-4 space-y-3 p-4">
          {[
            { icon: Mail, label: 'Email', value: user?.user?.email },
            { icon: Shield, label: 'Referral Code', value: user?.referral_code },
            { icon: Wallet, label: 'Available Balance', value: `$${parseFloat(user?.available_balance || 0).toFixed(2)}` },
            { icon: TrendingUp, label: 'Referral Bonus', value: `$${parseFloat(user?.total_referral_bonus || 0).toFixed(2)}` },
            { icon: ArrowDownToLine, label: 'Total Referrals', value: user?.total_referrals ?? 0 },
            { icon: ArrowUpFromLine, label: 'Active Referrals', value: user?.active_referrals ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 border-b border-cs-border/50 py-2 last:border-0">
              <Icon size={18} className="text-cs-purple" />
              <div>
                <p className="text-[10px] text-gray-500">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-dark mb-4 grid grid-cols-2 gap-2 p-3">
          {[
            { label: 'About Us', path: '/about' },
            { label: 'Help & Support', path: '/help' },
            { label: 'Contact Us', path: '/contact' },
            { label: 'Extra Bonus', path: '/bonus' },
            { label: 'My Team', path: '/team' },
          ].map(({ label, path }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className="rounded-xl border border-cs-border bg-cs-dark py-2.5 text-xs font-semibold text-gray-300 hover:border-cs-purple/40 hover:text-cs-purple"
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cs-red/30 bg-cs-red/10 py-3 font-bold text-cs-red transition-colors hover:bg-cs-red/20"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

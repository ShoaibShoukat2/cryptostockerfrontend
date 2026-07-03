import { useState, useEffect } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { userAPI } from '../api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { referralIconPng } from '../components/DashboardIcons';

export default function Team() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await refreshUser();
        const { data: dash } = await userAPI.getDashboard();
        setData(dash);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshUser]);

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCode = async () => {
    const text = `Join Crypto Stacker with my referral code: ${user?.referral_code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Crypto Stacker', text });
        return;
      } catch {
        /* fallback */
      }
    }
    copyCode();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cs-mesh">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cs-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} notifications={data?.unread_notifications || 0} />
        <div className="card-dark glow-purple mb-4 p-6">
          <div className="mb-4 flex items-center gap-3">
            <img src={referralIconPng} alt="My Team" className="h-10 w-10 object-contain" draggable={false} />
            <h2 className="text-xl font-bold">My Team</h2>
          </div>

          <div className="mb-4 rounded-xl border border-cs-border bg-cs-dark p-4 text-center">
            <p className="mb-1 text-xs text-gray-500">Your Referral Code</p>
            <p className="mb-2 font-mono text-2xl font-bold text-cs-gold">{user?.referral_code}</p>
            <div className="flex justify-center gap-2">
              <button type="button" onClick={copyCode} className="gradient-btn flex items-center gap-1 rounded-xl px-4 py-2 text-sm text-white">
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button type="button" onClick={shareCode} className="flex items-center gap-1 rounded-xl border border-cs-purple/30 bg-cs-purple/10 px-4 py-2 text-sm text-cs-purple">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className="text-xl font-bold text-cs-purple">{user?.total_referrals || 0}</p>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className="text-xl font-bold text-cs-green">{user?.active_referrals || 0}</p>
              <p className="text-[10px] text-gray-500">Active</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className="text-xl font-bold text-cs-gold">${parseFloat(user?.total_referral_bonus || 0).toFixed(0)}</p>
              <p className="text-[10px] text-gray-500">Bonus</p>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-semibold">Team Levels</h3>
          {data?.referral_levels?.map((level) => (
            <div key={level.level} className="flex items-center justify-between border-b border-cs-border py-3">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  level.level === 1 ? 'bg-cs-purple/20 text-cs-purple' :
                  level.level === 2 ? 'bg-cs-green/20 text-cs-green' :
                  'bg-cs-gold/20 text-cs-gold'
                }`}>
                  L{level.level}
                </div>
                <div>
                  <p className="text-sm font-medium">Level {level.level} Team</p>
                  <p className="text-[10px] text-gray-500">{level.members} members</p>
                </div>
              </div>
              <p className="text-sm font-bold text-cs-green">${level.earnings.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

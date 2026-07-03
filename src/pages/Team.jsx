import { useState, useEffect } from 'react';
import { Copy, Share2, CheckCircle, Lock } from 'lucide-react';
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
            <div>
              <h2 className="text-xl font-bold">My Team</h2>
              <p className="text-xs text-cs-gold">12% commission on deposits</p>
            </div>
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
              <p className="text-[10px] text-gray-500">Direct</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className="text-xl font-bold text-cs-green">{data?.referral_levels?.[0]?.indirect_members ?? 0}</p>
              <p className="text-[10px] text-gray-500">Indirect</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3 text-center">
              <p className="text-xl font-bold text-cs-gold">${parseFloat(user?.total_referral_bonus || 0).toFixed(0)}</p>
              <p className="text-[10px] text-gray-500">Commission</p>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-semibold">Referral Tier Levels</h3>
          <p className="mb-4 text-[10px] text-gray-500">
            Higher tiers unlock greater daily stack profit on your total balance.
          </p>
          {data?.referral_levels?.map((level) => (
            <div
              key={level.level}
              className={`mb-3 rounded-xl border p-4 ${
                level.current
                  ? 'border-cs-purple/50 bg-cs-purple/10'
                  : level.unlocked
                    ? 'border-cs-green/30 bg-cs-green/5'
                    : 'border-cs-border/50 bg-cs-dark/40'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cs-purple/20 text-xs font-bold text-cs-purple">
                    L{level.level}
                  </span>
                  <div>
                    <p className="text-sm font-bold">Level {level.level}</p>
                    <p className="text-xs text-cs-green">{level.profit_percent} daily profit</p>
                  </div>
                </div>
                {level.current && (
                  <span className="rounded-full bg-cs-purple/30 px-2 py-0.5 text-[9px] font-bold text-cs-purple">CURRENT</span>
                )}
                {level.unlocked && !level.current && (
                  <CheckCircle size={16} className="text-cs-green" />
                )}
                {!level.unlocked && <Lock size={14} className="text-gray-600" />}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-black/30 p-2">
                  <p className="text-gray-500">Direct Members</p>
                  <p className={`font-bold ${level.direct_members >= level.direct_required ? 'text-cs-green' : 'text-white'}`}>
                    {level.direct_members} / {level.direct_required}
                  </p>
                </div>
                <div className="rounded-lg bg-black/30 p-2">
                  <p className="text-gray-500">Indirect Members</p>
                  <p className={`font-bold ${level.indirect_members >= level.indirect_required ? 'text-cs-green' : 'text-white'}`}>
                    {level.indirect_members} / {level.indirect_required}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg bg-black/30 p-2">
                  <p className="text-gray-500">Your Total Deposit</p>
                  <p className={`font-bold ${level.user_deposit >= level.deposit_required ? 'text-cs-green' : 'text-white'}`}>
                    ${level.user_deposit.toFixed(2)} / ${level.deposit_required.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

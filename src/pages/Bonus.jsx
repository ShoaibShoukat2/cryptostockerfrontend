import { useState, useEffect } from 'react';
import { Gift, Users, CheckCircle, Copy, Share2 } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export default function Bonus() {
  const { user } = useAuth();
  const [bonus, setBonus] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    userAPI.getDashboard().then(({ data }) => {
      setBonus(data.daily_bonus);
    }).catch(() => {});
  }, []);

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

  const count = bonus?.qualified_referrals ?? bonus?.referrals_today ?? 0;
  const required = bonus?.required ?? 3;
  const amount = bonus?.bonus_amount ?? 15;
  const minDeposit = bonus?.min_deposit_required ?? 100;
  const awarded = bonus?.awarded_lifetime ?? bonus?.awarded_today ?? false;
  const progress = Math.min(100, (count / required) * 100);

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <div className="card-dark glow-gold mb-4 overflow-hidden p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cs-gold/20">
              <Gift size={28} className="text-cs-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Extra Bonus</h1>
              <p className="text-sm text-gray-400">
                {required} referrals with ${minDeposit} deposit each
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-cs-gold/30 bg-cs-gold/10 p-5 text-center">
            <p className="text-4xl font-black text-cs-gold">${amount}</p>
            <p className="mt-1 text-xs text-gray-400">Bonus Reward</p>
          </div>

          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-400">Qualifying Referrals</span>
            <span className="font-bold text-white">{count} / {required}</span>
          </div>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-cs-dark">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cs-gold to-cs-orange transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-6 rounded-xl border border-cs-gold/30 bg-cs-dark p-4 text-center">
            <p className="mb-1 text-xs text-gray-500">Your Referral Code</p>
            <p className="mb-3 font-mono text-2xl font-bold text-cs-gold">
              {user?.referral_code || '------'}
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={copyCode}
                className="gradient-btn flex items-center gap-1 rounded-xl px-4 py-2 text-sm text-white"
              >
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={shareCode}
                className="flex items-center gap-1 rounded-xl border border-cs-gold/40 bg-cs-gold/10 px-4 py-2 text-sm font-semibold text-cs-gold"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {awarded ? (
            <div className="flex items-center gap-2 rounded-xl border border-cs-green/30 bg-cs-green/10 p-4 text-cs-green">
              <CheckCircle size={20} />
              <span className="text-sm font-semibold">Lifetime bonus already claimed!</span>
            </div>
          ) : (
            <div className="rounded-xl border border-cs-border/50 bg-cs-dark/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Users size={16} className="text-cs-purple" />
                How to earn
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Invite {required} members using your referral code. Each member must deposit
                at least ${minDeposit} (approved by admin) to count toward your bonus.
                When all {required} qualify, you receive ${amount} once — lifetime limit.
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

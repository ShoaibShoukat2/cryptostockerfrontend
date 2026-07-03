import { useState, useEffect } from 'react';
import { Gift, Users, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export default function Bonus() {
  const { user } = useAuth();
  const [bonus, setBonus] = useState(null);

  useEffect(() => {
    userAPI.getDashboard().then(({ data }) => {
      setBonus(data.daily_bonus);
    }).catch(() => {});
  }, []);

  const count = bonus?.referrals_today ?? 0;
  const required = bonus?.required ?? 3;
  const amount = bonus?.bonus_amount ?? 15;
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
              <h1 className="text-xl font-bold">Extra Daily Bonus</h1>
              <p className="text-sm text-gray-400">Refer {required} members in one day</p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-cs-gold/30 bg-cs-gold/10 p-5 text-center">
            <p className="text-4xl font-black text-cs-gold">${amount}</p>
            <p className="mt-1 text-xs text-gray-400">Bonus Reward</p>
          </div>

          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-400">Today&apos;s Referrals</span>
            <span className="font-bold text-white">{count} / {required}</span>
          </div>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-cs-dark">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cs-gold to-cs-orange transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {bonus?.awarded_today ? (
            <div className="flex items-center gap-2 rounded-xl border border-cs-green/30 bg-cs-green/10 p-4 text-cs-green">
              <CheckCircle size={20} />
              <span className="text-sm font-semibold">Bonus awarded today! Come back tomorrow.</span>
            </div>
          ) : (
            <div className="rounded-xl border border-cs-border/50 bg-cs-dark/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Users size={16} className="text-cs-purple" />
                How to earn
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Invite {required} new members using your referral code in a single day.
                When the {required}rd member registers, you automatically receive ${amount} bonus
                added to your balance.
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

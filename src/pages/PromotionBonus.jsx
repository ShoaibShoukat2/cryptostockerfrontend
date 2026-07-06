import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import PromotionBonusBox from '../components/PromotionBonusBox';
import { useAuth } from '../context/AuthContext';

export default function PromotionBonus() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <PromotionBonusBox />

        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="mb-4 w-full rounded-2xl border border-cs-gold/40 bg-gradient-to-r from-cs-gold/15 via-white/5 to-cs-purple/15 px-4 py-4 text-center shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-colors hover:border-cs-gold/60"
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <Crown size={16} className="text-cs-gold" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cs-gold">Leader Bonus</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-white">
            If you are a leader then contact us you will get more bonus!
          </p>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

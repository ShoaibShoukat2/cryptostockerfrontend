import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function ExtraBonusFab({ dailyBonus }) {
  const navigate = useNavigate();
  const count = dailyBonus?.referrals_today ?? 0;
  const required = dailyBonus?.required ?? 3;
  const remaining = dailyBonus?.remaining ?? required;

  return (
    <motion.button
      type="button"
      onClick={() => navigate('/bonus')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-1"
      aria-label="Extra Bonus"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cs-gold/40 bg-gradient-to-br from-cs-gold/30 to-cs-orange/20 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
        <Gift size={24} className="text-cs-gold" />
        {!dailyBonus?.awarded_today && remaining > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cs-red text-[9px] font-bold text-white">
            {remaining}
          </span>
        )}
        {dailyBonus?.awarded_today && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cs-green text-[8px] font-bold text-white">
            ✓
          </span>
        )}
      </div>
      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-cs-gold">
        ${dailyBonus?.bonus_amount ?? 15}
      </span>
      <span className="text-[7px] text-gray-500">{count}/{required}</span>
    </motion.button>
  );
}

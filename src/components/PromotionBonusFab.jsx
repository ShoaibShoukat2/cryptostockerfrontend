import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { userAPI } from '../api';

const DEFAULT_CONFIG = {
  promotion_tier1_reward: 5,
  promotion_tier2_reward: 10,
  promotion_tier3_reward: 30,
};

export default function PromotionBonusFab() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    userAPI.getSiteConfig()
      .then(({ data }) => setConfig({ ...DEFAULT_CONFIG, ...data }))
      .catch(() => {});
  }, []);

  const rewards = [
    config.promotion_tier1_reward,
    config.promotion_tier2_reward,
    config.promotion_tier3_reward,
  ].map((r) => parseFloat(r || 0)).filter((r) => r > 0);

  const tierCount = rewards.length || 3;
  const maxReward = rewards.length ? Math.max(...rewards) : 30;

  return (
    <motion.button
      type="button"
      onClick={() => navigate('/promotion')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1"
      aria-label="Promotion Bonus"
    >
      <span className="text-[7px] font-bold text-cs-gold">Promotion Bonus</span>
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cs-gold/40 bg-gradient-to-br from-cs-gold/30 to-cs-orange/20 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
        <Megaphone size={24} className="text-cs-gold" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cs-red text-[9px] font-bold text-white">
          {tierCount}
        </span>
      </div>
      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-cs-gold">
        Up to ${maxReward.toFixed(0)}
      </span>
    </motion.button>
  );
}

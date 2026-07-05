import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { userAPI } from '../api';

const DEFAULT_CONFIG = {
  promotion_tier1_detail: 'Upload 1 video daily for 7 days',
  promotion_tier1_reward: 5,
  promotion_tier2_detail: '5k views on a video',
  promotion_tier2_reward: 10,
  promotion_tier3_detail: '10k views on a video',
  promotion_tier3_reward: 30,
};

export default function DashboardPromotionCard() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    userAPI.getSiteConfig()
      .then(({ data }) => setConfig({ ...DEFAULT_CONFIG, ...data }))
      .catch(() => {});
  }, []);

  const tiers = [
    { detail: config.promotion_tier1_detail, reward: config.promotion_tier1_reward },
    { detail: config.promotion_tier2_detail, reward: config.promotion_tier2_reward },
    { detail: config.promotion_tier3_detail, reward: config.promotion_tier3_reward },
  ].filter((tier) => tier.detail);

  return (
    <button
      type="button"
      onClick={() => navigate('/promotion')}
      className="card-dark glow-gold flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-cs-gold/30 bg-gradient-to-b from-cs-gold/10 via-cs-dark/90 to-cs-purple/10 p-2 text-left shadow-[0_0_16px_rgba(245,158,11,0.15)] transition-transform active:scale-[0.98] sm:p-2.5"
    >
      <div className="mb-2 flex flex-col items-center gap-1 border-b border-cs-border/40 pb-2 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cs-gold/20">
          <Megaphone size={14} className="text-cs-gold" />
        </div>
        <p className="text-[8px] font-bold leading-tight text-cs-gold sm:text-[9px]">Promotion Bonus</p>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2">
        {tiers.map((tier, index) => (
          <div
            key={`${tier.detail}-${index}`}
            className="rounded-lg border border-cs-border/40 bg-black/25 px-1.5 py-1.5 sm:px-2"
          >
            <p className="text-[7px] leading-snug text-gray-300 sm:text-[8px]">
              {tier.detail}
            </p>
            <p className="mt-0.5 text-[8px] font-bold text-cs-gold sm:text-[9px]">
              Reward ${parseFloat(tier.reward || 0).toFixed(0)}
            </p>
          </div>
        ))}
      </div>
    </button>
  );
}

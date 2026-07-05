import { useEffect, useState } from 'react';
import { Video, Megaphone } from 'lucide-react';
import { userAPI } from '../api';

const TIER_STYLES = [
  {
    accent: 'border-cs-purple/30 bg-cs-purple/10',
    iconBg: 'bg-cs-purple/20',
    iconColor: 'text-cs-purple',
  },
  {
    accent: 'border-cs-border/50 bg-cs-dark/60',
    iconBg: 'bg-cs-green/20',
    iconColor: 'text-cs-green',
  },
  {
    accent: 'border-cs-gold/30 bg-cs-gold/10',
    iconBg: 'bg-cs-gold/20',
    iconColor: 'text-cs-gold',
  },
];

const DEFAULT_CONFIG = {
  promotion_bonus_subtitle: 'Upload videos and earn extra rewards',
  promotion_bonus_note: 'Contact support on Telegram to claim your promotion bonus rewards.',
  promotion_tier1_detail: 'Upload 1 video daily for 7 days',
  promotion_tier1_reward: 5,
  promotion_tier2_detail: '5k views on a video',
  promotion_tier2_reward: 10,
  promotion_tier3_detail: '10k views on a video',
  promotion_tier3_reward: 30,
};

function buildTiers(config) {
  return [
    { detail: config.promotion_tier1_detail, reward: config.promotion_tier1_reward },
    { detail: config.promotion_tier2_detail, reward: config.promotion_tier2_reward },
    { detail: config.promotion_tier3_detail, reward: config.promotion_tier3_reward },
  ].filter((tier) => tier.detail);
}

export default function PromotionBonusBox({ compact = false, className = '' }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    userAPI.getSiteConfig()
      .then(({ data }) => setConfig({ ...DEFAULT_CONFIG, ...data }))
      .catch(() => {});
  }, []);

  const tiers = buildTiers(config);

  return (
    <div className={`overflow-hidden rounded-xl border border-cs-purple/30 bg-gradient-to-r from-cs-purple/10 via-cs-dark/80 to-cs-gold/10 p-5 shadow-[0_0_18px_rgba(139,92,246,0.18)] ${compact ? '' : 'mb-4'} ${className}`}>
      <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className={`flex shrink-0 items-center justify-center rounded-xl bg-cs-purple/20 ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}>
          <Megaphone size={compact ? 20 : 28} className="text-cs-purple" />
        </div>
        <div>
          <h1 className={`font-bold text-white ${compact ? 'text-sm' : 'text-xl'}`}>Promotion Bonus</h1>
          <p className={`text-gray-400 ${compact ? 'text-[11px]' : 'text-sm'}`}>{config.promotion_bonus_subtitle}</p>
        </div>
      </div>

      <div className={`space-y-2 ${compact ? '' : 'space-y-3'}`}>
        {tiers.map((item, index) => {
          const style = TIER_STYLES[index] || TIER_STYLES[0];
          return (
            <div
              key={`${item.detail}-${index}`}
              className={`flex items-start gap-3 rounded-xl border p-3 ${compact ? '' : 'p-4'} ${style.accent}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}>
                <Video size={16} className={style.iconColor} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">{item.detail}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-cs-gold/20 px-2 py-1 text-xs font-bold text-cs-gold">
                ${parseFloat(item.reward || 0).toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>

      {config.promotion_bonus_note && (
        <p className={`mt-3 text-center text-gray-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {config.promotion_bonus_note}
        </p>
      )}
    </div>
  );
}

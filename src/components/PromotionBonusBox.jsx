import { Video, Megaphone } from 'lucide-react';

export default function PromotionBonusBox({ compact = false, className = '' }) {
  const rewards = [
    {
      title: 'Daily Upload Streak',
      detail: 'Upload 1 video daily for 7 days',
      reward: '$5',
      accent: 'border-cs-purple/30 bg-cs-purple/10',
      iconBg: 'bg-cs-purple/20',
      iconColor: 'text-cs-purple',
    },
    {
      title: '5K Views Milestone',
      detail: '5k views on a video',
      reward: '$10',
      accent: 'border-cs-border/50 bg-cs-dark/60',
      iconBg: 'bg-cs-green/20',
      iconColor: 'text-cs-green',
    },
    {
      title: '10K Views Milestone',
      detail: '10k views on a video',
      reward: '$30',
      accent: 'border-cs-gold/30 bg-cs-gold/10',
      iconBg: 'bg-cs-gold/20',
      iconColor: 'text-cs-gold',
    },
  ];

  return (
    <div className={`overflow-hidden rounded-xl border border-cs-purple/30 bg-gradient-to-r from-cs-purple/10 via-cs-dark/80 to-cs-gold/10 p-4 shadow-[0_0_18px_rgba(139,92,246,0.18)] ${compact ? '' : 'mb-4'} ${className}`}>
      <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-5'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cs-purple/20">
          <Megaphone size={20} className="text-cs-purple" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Promotion Bonus</h3>
          <p className="text-[11px] text-gray-400">Upload videos and earn extra rewards</p>
        </div>
      </div>

      <div className="space-y-2">
        {rewards.map((item) => (
          <div
            key={item.title}
            className={`flex items-start gap-3 rounded-xl border p-3 ${item.accent}`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}>
              <Video size={16} className={item.iconColor} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">{item.detail}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-cs-gold/20 px-2 py-1 text-xs font-bold text-cs-gold">
              {item.reward}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] text-gray-500">
        Contact support on Telegram to claim your promotion bonus rewards.
      </p>
    </div>
  );
}

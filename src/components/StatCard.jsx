import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { STAT_NEON_ICONS } from './DashboardIcons';

const THEME = {
  purple: {
    stroke: '#A855F7',
    strokeBright: '#C084FC',
    fillTop: 'rgba(168, 85, 247, 0.55)',
    fillMid: 'rgba(168, 85, 247, 0.15)',
    border: 'border-purple-500/25',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.2),inset_0_1px_0_rgba(168,85,247,0.1)]',
  },
  green: {
    stroke: '#22C55E',
    strokeBright: '#4ADE80',
    fillTop: 'rgba(34, 197, 94, 0.55)',
    fillMid: 'rgba(34, 197, 94, 0.15)',
    border: 'border-green-500/25',
    glow: 'shadow-[0_0_24px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(34,197,94,0.1)]',
  },
  orange: {
    stroke: '#F97316',
    strokeBright: '#FB923C',
    fillTop: 'rgba(249, 115, 22, 0.55)',
    fillMid: 'rgba(249, 115, 22, 0.15)',
    border: 'border-orange-500/25',
    glow: 'shadow-[0_0_24px_rgba(249,115,22,0.2),inset_0_1px_0_rgba(249,115,22,0.1)]',
  },
  red: {
    stroke: '#EF4444',
    strokeBright: '#F87171',
    fillTop: 'rgba(239, 68, 68, 0.55)',
    fillMid: 'rgba(239, 68, 68, 0.15)',
    border: 'border-red-500/25',
    glow: 'shadow-[0_0_24px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(239,68,68,0.1)]',
  },
};

const DEFAULT_TRENDS = {
  purple: [18, 32, 26, 44, 36, 52, 46, 60, 54, 68, 62, 78],
  green:  [12, 22, 28, 24, 38, 42, 36, 50, 56, 52, 66, 72],
  orange: [10, 18, 24, 20, 34, 30, 44, 40, 54, 48, 62, 68],
  red:    [8, 16, 14, 26, 22, 36, 32, 46, 42, 56, 52, 64],
};

function buildChartData(trend, color) {
  const raw = trend?.length > 0 ? trend : DEFAULT_TRENDS[color] || DEFAULT_TRENDS.purple;
  return raw.map((v, i) => ({ i, v: Number(v) || 0 }));
}

export default function StatCard({
  title,
  value,
  color = 'purple',
  prefix = '$',
  trend = [],
  index = 0,
  subValue,
}) {
  const theme = THEME[color] || THEME.purple;
  const NeonIcon = STAT_NEON_ICONS[color] || STAT_NEON_ICONS.purple;
  const chartData = buildChartData(trend, color);
  const gradId = `stat-grad-${color}-${index}`;
  const glowId = `stat-glow-${color}-${index}`;
  const lineGlowId = `stat-line-glow-${color}-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`stat-neon-card relative overflow-hidden rounded-2xl border bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-3 ${theme.border} ${theme.glow}`}
    >
      {/* Icon top-left */}
      <div className="mb-2">
        <NeonIcon size="sm" />
      </div>

      {/* Text */}
      <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-300">{title}</p>
      <p className="mt-0.5 text-lg font-bold leading-tight text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
      </p>
      {subValue && (
        <p className="mt-0.5 text-[9px] text-gray-500">{subValue}</p>
      )}

      {/* Neon jagged graph */}
      <div className="stat-neon-chart -mx-3 -mb-3 mt-3 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.stroke} stopOpacity={0.7} />
                <stop offset="45%" stopColor={theme.stroke} stopOpacity={0.25} />
                <stop offset="100%" stopColor={theme.stroke} stopOpacity={0} />
              </linearGradient>
              <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={lineGlowId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="lineBlur" />
                <feMerge>
                  <feMergeNode in="lineBlur" />
                  <feMergeNode in="lineBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Area
              type="linear"
              dataKey="v"
              stroke={theme.strokeBright}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              filter={`url(#${lineGlowId})`}
              isAnimationActive
              animationDuration={1800}
              animationBegin={index * 120}
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

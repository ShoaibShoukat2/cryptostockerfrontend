import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { STAT_NEON_ICONS } from './DashboardIcons';

const colorMap = {
  purple: { stroke: '#8B5CF6', fill: 'rgba(139,92,246,0.15)' },
  green: { stroke: '#22C55E', fill: 'rgba(34,197,94,0.15)' },
  orange: { stroke: '#F97316', fill: 'rgba(249,115,22,0.15)' },
  red: { stroke: '#EF4444', fill: 'rgba(239,68,68,0.15)' },
  gold: { stroke: '#F59E0B', fill: 'rgba(245,158,11,0.15)' },
};

const glowMap = {
  purple: 'glow-purple',
  green: 'glow-green',
  orange: 'glow-orange',
  red: 'glow-red',
  gold: 'glow-gold',
};

const EMPTY_TREND = Array.from({ length: 12 }, () => ({ v: 0 }));

export default function StatCard({
  title, value, color = 'purple', prefix = '$', trend = [], index = 0, subValue,
}) {
  const colors = colorMap[color];
  const NeonIcon = STAT_NEON_ICONS[color] || STAT_NEON_ICONS.purple;
  const chartData = trend.length > 0
    ? trend.map((v) => ({ v: Number(v) || 0 }))
    : EMPTY_TREND;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`card-dark p-3 ${glowMap[color]}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-wide text-gray-400">{title}</p>
          <p className="text-base font-bold leading-tight" style={{ color: colors.stroke }}>
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
          </p>
          {subValue && (
            <p className="mt-0.5 text-[9px] text-gray-500">{subValue}</p>
          )}
        </div>
        <NeonIcon size="sm" />
      </div>
      <div className="chart-draw h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${color}-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={colors.stroke}
              fill={`url(#grad-${color}-${index})`}
              strokeWidth={2}
              animationDuration={1500}
              animationBegin={index * 100}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

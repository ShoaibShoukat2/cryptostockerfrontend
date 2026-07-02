import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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

export default function StatCard({ title, value, color = 'purple', prefix = '$', trend = [], index = 0 }) {
  const colors = colorMap[color];
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
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">{title}</p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2 }}
        className="text-lg font-bold"
        style={{ color: colors.stroke, textShadow: `0 0 20px ${colors.stroke}40` }}
      >
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
      </motion.p>
      <div className="chart-draw mt-1 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={colors.stroke}
              fill={`url(#grad-${color})`}
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

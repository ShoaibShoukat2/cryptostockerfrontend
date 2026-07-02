import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const colorMap = {
  purple: { stroke: '#8B5CF6', fill: 'rgba(139,92,246,0.1)' },
  green: { stroke: '#22C55E', fill: 'rgba(34,197,94,0.1)' },
  orange: { stroke: '#F97316', fill: 'rgba(249,115,22,0.1)' },
  red: { stroke: '#EF4444', fill: 'rgba(239,68,68,0.1)' },
  gold: { stroke: '#F59E0B', fill: 'rgba(245,158,11,0.1)' },
};

const glowMap = {
  purple: 'glow-purple',
  green: 'glow-green',
  orange: 'glow-orange',
  red: 'glow-red',
  gold: 'glow-gold',
};

const EMPTY_TREND = Array.from({ length: 12 }, () => ({ v: 0 }));

export default function StatCard({ title, value, color = 'purple', prefix = '$', trend = [] }) {
  const colors = colorMap[color];
  const chartData = trend.length > 0
    ? trend.map((v) => ({ v: Number(v) || 0 }))
    : EMPTY_TREND;

  return (
    <div className={`card-dark p-3 ${glowMap[color]}`}>
      <p className="mb-1 text-[10px] text-gray-400">{title}</p>
      <p className="text-lg font-bold" style={{ color: colors.stroke }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
      </p>
      <div className="mt-1 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <Area type="monotone" dataKey="v" stroke={colors.stroke} fill={colors.fill} strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

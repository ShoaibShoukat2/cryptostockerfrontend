import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function CandlestickChart({ candles = [] }) {
  const data = candles.map((c, i) => ({
    name: i,
    open: c.open,
    close: c.close,
    high: c.high,
    low: c.low,
    body: [Math.min(c.open, c.close), Math.max(c.open, c.close)],
    isGreen: c.close >= c.open,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey="name" hide />
        <YAxis domain={['auto', 'auto']} hide />
        <Bar dataKey="body" barSize={6}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isGreen ? '#22C55E' : '#EF4444'} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

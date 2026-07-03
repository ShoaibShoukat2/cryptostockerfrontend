import {
  ComposedChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Customized,
  CartesianGrid,
} from 'recharts';

const GREEN = '#22C55E';
const RED = '#EF4444';

function Candlesticks({ xAxisMap, yAxisMap, offset, data, width }) {
  if (!data?.length || !xAxisMap || !yAxisMap) return null;

  const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
  const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
  if (!xAxis?.scale || !yAxis?.scale) return null;

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const chartWidth = width - offset.left - offset.right;
  const candleWidth = Math.max(3, Math.min(10, (chartWidth / data.length) * 0.6));
  const halfW = candleWidth / 2;

  const getX = (index) => {
    const x = xScale(index);
    if (x == null) return null;
    const bandwidth = typeof xScale.bandwidth === 'function' ? xScale.bandwidth() : 0;
    return x + bandwidth / 2;
  };

  return (
    <g className="candlesticks">
      {data.map((entry) => {
        const x = getX(entry.name);
        if (x == null) return null;

        const color = entry.isGreen ? GREEN : RED;
        const bodyTop = yScale(Math.max(entry.open, entry.close));
        const bodyBottom = yScale(Math.min(entry.open, entry.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={entry.name}>
            <line
              x1={x}
              y1={yScale(entry.high)}
              x2={x}
              y2={yScale(entry.low)}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={x - halfW}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
            />
          </g>
        );
      })}
    </g>
  );
}

export default function CandlestickChart({ candles = [] }) {
  const data = candles.map((c, i) => ({
    name: i,
    open: c.open,
    close: c.close,
    high: c.high,
    low: c.low,
    isGreen: c.close >= c.open,
  }));

  if (!data.length) return null;

  const yMin = Math.min(...data.map((d) => d.low));
  const yMax = Math.max(...data.map((d) => d.high));
  const padding = (yMax - yMin) * 0.06 || 1;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} opacity={0.35} />
        <XAxis dataKey="name" hide />
        <YAxis domain={[yMin - padding, yMax + padding]} hide allowDataOverflow />
        <Customized component={(props) => <Candlesticks {...props} data={data} />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

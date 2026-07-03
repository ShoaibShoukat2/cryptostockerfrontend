const GREEN = '#22C55E';
const RED = '#EF4444';

export default function CandlestickChart({ candles = [] }) {
  if (!candles.length) return null;

  const width = 360;
  const height = 180;
  const padX = 8;
  const padY = 10;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const lows = candles.map((c) => Number(c.low));
  const highs = candles.map((c) => Number(c.high));
  let yMin = Math.min(...lows);
  let yMax = Math.max(...highs);
  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) return null;
  if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }

  const padding = (yMax - yMin) * 0.06;
  yMin -= padding;
  yMax += padding;
  const yRange = yMax - yMin;

  const slot = chartW / candles.length;
  const bodyW = Math.max(3, Math.min(10, slot * 0.55));

  const toY = (price) => padY + ((yMax - price) / yRange) * chartH;

  const gridLines = 4;
  const gridYs = Array.from({ length: gridLines + 1 }, (_, i) => padY + (chartH / gridLines) * i);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-black/20">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[180px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="BTC price candlestick chart"
      >
        {gridYs.map((y) => (
          <line
            key={y}
            x1={padX}
            y1={y}
            x2={width - padX}
            y2={y}
            stroke="#374151"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.35}
          />
        ))}

        {candles.map((c, i) => {
          const open = Number(c.open);
          const close = Number(c.close);
          const high = Number(c.high);
          const low = Number(c.low);
          if (![open, close, high, low].every(Number.isFinite)) return null;

          const x = padX + slot * i + slot / 2;
          const color = close >= open ? GREEN : RED;
          const bodyTop = toY(Math.max(open, close));
          const bodyBottom = toY(Math.min(open, close));
          const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);

          return (
            <g key={i}>
              <line
                x1={x}
                y1={toY(high)}
                x2={x}
                y2={toY(low)}
                stroke={color}
                strokeWidth={1.25}
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={x - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyHeight}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

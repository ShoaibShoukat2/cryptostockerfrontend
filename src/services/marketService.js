import { userAPI } from '../api';

const BINANCE_BASE = 'https://data-api.binance.vision/api/v3';
const SYMBOL = 'BTCUSDT';

const INTERVAL_MAP = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Market fetch failed: ${res.status}`);
  return res.json();
}

async function fetchFromBinance(timeframe = '15m') {
  const interval = INTERVAL_MAP[timeframe] || '15m';

  const [ticker, klines, trades] = await Promise.all([
    fetchJson(`${BINANCE_BASE}/ticker/24hr?symbol=${SYMBOL}`),
    fetchJson(`${BINANCE_BASE}/klines?symbol=${SYMBOL}&interval=${interval}&limit=30`),
    fetchJson(`${BINANCE_BASE}/trades?symbol=${SYMBOL}&limit=10`),
  ]);

  const candles = klines.map((k, i) => ({
    time: i,
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
  }));

  const live_trades = [...trades].reverse().map((trade) => ({
    type: trade.isBuyerMaker ? 'SELL' : 'BUY',
    price: parseFloat(trade.price),
    amount: parseFloat(trade.qty),
    time: trade.time,
  }));

  return {
    symbol: 'BTC/USDT',
    price: parseFloat(ticker.lastPrice),
    change: parseFloat(ticker.priceChangePercent),
    high_24h: parseFloat(ticker.highPrice),
    low_24h: parseFloat(ticker.lowPrice),
    volume_24h: ticker.volume,
    candles,
    live_trades,
    source: 'binance',
  };
}

async function fetchFromBackend(timeframe = '15m') {
  const { data } = await userAPI.getMarket(timeframe);
  if (!data?.candles?.length && !data?.price) {
    throw new Error(data?.error || 'No market data');
  }
  return data;
}

export async function getBtcMarket(timeframe = '15m') {
  try {
    return await fetchFromBackend(timeframe);
  } catch {
    return fetchFromBinance(timeframe);
  }
}

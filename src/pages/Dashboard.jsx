import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, Clock, Copy, Gift,
  Shield, TrendingUp, Zap, Headphones, Share2,
} from 'lucide-react';
import { userAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import Header, { CountdownTimer } from '../components/Header';
import BottomNav from '../components/BottomNav';
import StatCard from '../components/StatCard';
import CandlestickChart from '../components/CandlestickChart';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [market, setMarket] = useState(null);
  const [stacking, setStacking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeframe, setTimeframe] = useState('15m');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [marketError, setMarketError] = useState('');
  const [marketLoading, setMarketLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { data: dash } = await userAPI.getDashboard();
      setData(dash);
      setError('');
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMarket = useCallback(async (tf = timeframe) => {
    setMarketLoading(true);
    try {
      const { data: mkt } = await userAPI.getMarket(tf);
      setMarket(mkt);
      setMarketError('');
    } catch {
      setMarket(null);
      setMarketError('Live market data unavailable.');
    } finally {
      setMarketLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadData();
    loadMarket(timeframe);
    refreshUser();
    const interval = setInterval(() => loadMarket(timeframe), 30000);
    return () => clearInterval(interval);
  }, [loadData, loadMarket, refreshUser, timeframe]);

  const formatTradeTime = (timestamp) => {
    if (!timestamp) return '';
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  const formatVolume = (vol) => {
    const n = parseFloat(vol);
    if (Number.isNaN(n)) return vol || '0';
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    return n.toLocaleString();
  };

  const handleStack = async () => {
    setStacking(true);
    try {
      await userAPI.stack();
      await refreshUser();
      await loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Stack failed');
    } finally {
      setStacking(false);
    }
  };

  const copyReferral = () => {
    const code = data?.profile?.referral_code || user?.referral_code || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteFriends = async () => {
    const code = data?.profile?.referral_code || user?.referral_code || '';
    const text = `Join Crypto Stacker with my referral code: ${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Crypto Stacker', text });
      } catch {
        copyReferral();
      }
    } else {
      copyReferral();
    }
  };

  const profile = data?.profile || user;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cs-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={profile} notifications={data?.unread_notifications || 0} />

        {error && (
          <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
            {error}
            <button type="button" onClick={loadData} className="ml-2 underline">Retry</button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark glow-purple relative mb-4 overflow-hidden p-4"
        >
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-cs-purple/10 blur-2xl" />
          <div className="flex items-start gap-3">
            <div className="float-anim">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cs-purple/50 bg-gradient-to-br from-cs-purple to-cs-purple-dark text-2xl font-black"
                style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
              >
                C
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-sm font-bold">STACK YOUR BALANCE</h3>
                <span className="rounded bg-cs-purple/20 px-1.5 py-0.5 text-[9px] font-bold text-cs-purple">24H</span>
              </div>
              <p className="mb-2 text-[10px] text-gray-400">Stack your balance and earn daily profits.</p>
              <p className="text-xs text-gray-400">Available Balance</p>
              <p className="text-xl font-bold text-white">
                ${parseFloat(profile?.available_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-gray-500">~{data?.btc_equivalent || 0} BTC</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-2 text-center">
              <p className="mb-1 text-[8px] text-gray-500">Next Stack Available In</p>
              <CountdownTimer seconds={profile?.next_stack_in_seconds || 0} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleStack}
            disabled={stacking || !profile?.can_stack}
            className="gradient-btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white disabled:opacity-40"
          >
            <Wallet size={18} />
            {stacking ? 'Stacking...' : profile?.can_stack ? 'Stack Now' : 'Stacked - Wait 24H'}
          </button>
          <p className="mt-2 text-center text-[9px] text-gray-600">
            You can stack your balance once every 24 hours. After stacking, you will start earning daily profits.
          </p>
        </motion.div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => navigate('/deposit')} className="card-dark glow-purple p-3 text-left transition-colors hover:border-cs-purple/50">
            <ArrowDownToLine size={22} className="mb-2 text-cs-purple" />
            <p className="text-sm font-bold">Deposit</p>
            <p className="text-[10px] text-gray-500">Add funds to your account</p>
          </button>
          <button type="button" onClick={() => navigate('/withdraw')} className="card-dark glow-orange p-3 text-left transition-colors hover:border-cs-orange/50">
            <ArrowUpFromLine size={22} className="mb-2 text-cs-orange" />
            <p className="text-sm font-bold">Withdraw</p>
            <p className="text-[10px] text-gray-500">Withdraw your earnings</p>
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="card-dark glow-red p-3">
            <Clock size={18} className="mb-1 text-cs-red" />
            <p className="text-[10px] text-gray-400">Pending Deposits</p>
            <p className="text-sm font-bold text-cs-red">
              ${(data?.pending_deposits?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-gray-500">{data?.pending_deposits?.count || 0} Requests</p>
          </div>
          <div className="card-dark glow-gold p-3">
            <Clock size={18} className="mb-1 text-cs-gold" />
            <p className="text-[10px] text-gray-400">Pending Withdrawals</p>
            <p className="text-sm font-bold text-cs-gold">
              ${(data?.pending_withdrawals?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-gray-500">{data?.pending_withdrawals?.count || 0} Request</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <StatCard title="Total Balance" value={parseFloat(profile?.total_balance || 0)} color="purple" trend={data?.stats_trends?.balance} />
          <StatCard title="Total Deposit" value={parseFloat(profile?.total_deposit || 0)} color="green" trend={data?.stats_trends?.deposit} />
          <StatCard title="Total Withdraw" value={parseFloat(profile?.total_withdraw || 0)} color="orange" trend={data?.stats_trends?.withdraw} />
          <StatCard title="Total Profit" value={parseFloat(profile?.total_profit || 0)} color="red" trend={data?.stats_trends?.profit} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-dark glow-purple mb-4 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Gift size={20} className="text-cs-gold" />
            <h3 className="font-bold">Refer & Earn</h3>
          </div>
          <div className="mb-3 flex gap-2">
            <div className="flex-1 rounded-xl border border-cs-border bg-cs-dark px-3 py-2 font-mono text-sm text-cs-gold">
              {profile?.referral_code || '------'}
            </div>
            <button type="button" onClick={copyReferral} className="flex items-center gap-1 rounded-xl bg-cs-purple/20 px-4 text-sm font-semibold text-cs-purple">
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button type="button" onClick={inviteFriends} className="gradient-btn mb-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-white">
            <Share2 size={16} /> Invite Friends
          </button>
          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-cs-purple">{profile?.total_referrals || 0}</p>
              <p className="text-[9px] text-gray-500">Total Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-cs-green">{profile?.active_referrals || 0}</p>
              <p className="text-[9px] text-gray-500">Active Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-cs-gold">${parseFloat(profile?.total_referral_bonus || 0).toFixed(2)}</p>
              <p className="text-[9px] text-gray-500">Referral Bonus</p>
            </div>
          </div>
          {data?.referral_levels?.map((level) => (
            <div key={level.level} className="flex items-center justify-between border-t border-cs-border py-2">
              <span className="text-xs text-gray-400">Level {level.level} Team</span>
              <span className="text-xs">{level.members} members</span>
              <span className="text-xs font-semibold text-cs-green">${level.earnings.toFixed(2)}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-dark mb-4 p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">BTC/USDT Live Trade</h3>
              <span className="flex items-center gap-1 text-[10px] text-cs-green">
                <span className="pulse-live h-2 w-2 rounded-full bg-cs-green" /> Live
              </span>
            </div>
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            {marketLoading ? (
              <span className="text-sm text-gray-500">Loading market...</span>
            ) : market?.price ? (
              <>
                <span className="text-2xl font-bold text-cs-green">
                  {market.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-sm ${market.change >= 0 ? 'text-cs-green' : 'text-cs-red'}`}>
                  {market.change >= 0 ? '+' : ''}{Number(market.change).toFixed(2)}%
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">{marketError || 'No market data'}</span>
            )}
          </div>
          {market && (
            <div className="mb-3 flex flex-wrap gap-4 text-[10px] text-gray-500">
              <span>24H High: <span className="text-white">{market.high_24h?.toLocaleString()}</span></span>
              <span>24H Low: <span className="text-white">{market.low_24h?.toLocaleString()}</span></span>
              <span>Vol: <span className="text-white">{formatVolume(market.volume_24h)}</span></span>
            </div>
          )}

          {market?.candles?.length > 0 && <CandlestickChart candles={market.candles} />}

          <div className="mb-3 mt-3 flex flex-wrap gap-1">
            {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  timeframe === tf ? 'bg-cs-purple text-white' : 'bg-cs-dark text-gray-500'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => loadMarket(timeframe)}
            className="gradient-btn mb-3 w-full rounded-xl py-2 text-sm font-bold text-white"
          >
            Refresh Chart
          </button>

          <div className="space-y-1">
            <p className="mb-1 text-[10px] text-gray-500">Live Trades</p>
            {market?.live_trades?.length > 0 ? market.live_trades.map((trade, i) => (
              <div key={i} className="flex justify-between border-b border-cs-border/50 py-1 text-[10px]">
                <span className={trade.type === 'BUY' ? 'text-cs-green' : 'text-cs-red'}>{trade.type}</span>
                <span>{Number(trade.price).toLocaleString()}</span>
                <span className="text-gray-500">{trade.amount} BTC</span>
                <span className="text-gray-600">{formatTradeTime(trade.time)}</span>
              </div>
            )) : (
              <p className="py-2 text-center text-[10px] text-gray-500">No live trades available</p>
            )}
          </div>
        </motion.div>

        <div className="mb-4 grid grid-cols-4 gap-2">
          {[
            { icon: Shield, label: 'Secure & Safe', sub: 'Bank-level security' },
            { icon: TrendingUp, label: 'Daily Profits', sub: 'Earn consistent returns' },
            { icon: Zap, label: 'Instant Withdraw', sub: 'Withdraw anytime' },
            { icon: Headphones, label: '24/7 Support', sub: 'Always here to help' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="p-2 text-center">
              <Icon size={18} className="mx-auto mb-1 text-cs-purple" />
              <p className="text-[8px] font-semibold">{label}</p>
              <p className="text-[7px] text-gray-600">{sub}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet, Copy, ChevronRight, Maximize2, Info, Share2,
} from 'lucide-react';
import { userAPI } from '../api';
import { getBtcMarket } from '../services/marketService';
import { useAuth } from '../context/AuthContext';
import Header, { CountdownTimer } from '../components/Header';
import BottomNav from '../components/BottomNav';
import StatCard from '../components/StatCard';
import CandlestickChart from '../components/CandlestickChart';
import AnimatedValue from '../components/AnimatedValue';
import {
  DepositNeonIcon, WithdrawNeonIcon, PendingDepositNeonIcon, PendingWithdrawNeonIcon,
  GiftNeonIcon, ReferralNeonIcon, SecureNeonIcon, ProfitsNeonIcon, InstantNeonIcon, SupportNeonIcon,
} from '../components/DashboardIcons';
import logoImg from '../assets/logo.jpeg';

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
      const mkt = await getBtcMarket(tf);
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

  const btcEquivalent = data?.btc_equivalent
    || (market?.price && profile?.available_balance
      ? (parseFloat(profile.available_balance) / market.price).toFixed(3)
      : '0.000');

  const totalBtcEquivalent = market?.price && profile?.total_balance
    ? (parseFloat(profile.total_balance) / market.price).toFixed(3)
    : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cs-mesh">
        <div className="h-10 w-10 animate-spin rounded-full border-2 spinner-glow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={profile} notifications={data?.unread_notifications || 0} />

        {error && (
          <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
            {error}
            <button type="button" onClick={loadData} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Stack Your Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark stack-balance-card relative mb-4 overflow-hidden p-4"
        >
          <div className="flex gap-3">
            {/* Left: Logo emblem */}
            <div className="shrink-0">
              <div className="stack-emblem float-anim h-28 w-24 overflow-hidden rounded-xl sm:h-32 sm:w-28">
                <img
                  src={logoImg}
                  alt="Crypto Stacker"
                  className="h-[200%] w-full object-cover object-top"
                  draggable={false}
                />
              </div>
            </div>

            {/* Center: Balance info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <h3 className="text-xs font-bold tracking-wide sm:text-sm">STACK YOUR BALANCE</h3>
                <span className="rounded bg-cs-purple/25 px-1.5 py-0.5 text-[8px] font-bold text-cs-purple">24H</span>
              </div>
              <p className="mb-2 text-[9px] leading-snug text-gray-400 sm:text-[10px]">
                Stack your balance and earn daily profits.
              </p>
              <p className="text-[9px] italic text-gray-500">Available Balance</p>
              <AnimatedValue
                value={parseFloat(profile?.available_balance || 0)}
                className="text-lg font-bold text-white sm:text-xl"
              />
              <p className="flex items-center gap-1 text-[9px] text-gray-400">
                <span className="text-cs-gold">₿</span>
                ≈ {btcEquivalent} BTC
              </p>
            </div>

            {/* Right: Timer + Stack button */}
            <div className="flex w-[90px] shrink-0 flex-col gap-2 sm:w-[100px]">
              <div className="rounded-xl border border-cs-border/80 bg-cs-dark/80 p-2 text-center backdrop-blur-sm">
                <p className="mb-1 flex items-center justify-center gap-0.5 text-[7px] text-gray-500">
                  Next Stack Available In
                  <Info size={8} className="text-gray-600" />
                </p>
                <CountdownTimer seconds={profile?.next_stack_in_seconds || 0} showLabels />
              </div>
              <button
                type="button"
                onClick={handleStack}
                disabled={stacking || !profile?.can_stack}
                className="gradient-btn-cta flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-[10px] font-bold text-white disabled:opacity-40 sm:text-xs"
              >
                <Wallet size={14} />
                {stacking ? '...' : profile?.can_stack ? 'Stack Now' : 'Wait 24H'}
              </button>
            </div>
          </div>

          <p className="mt-3 text-right text-[8px] leading-relaxed text-gray-600 sm:text-[9px]">
            You can stack your balance once every 24 hours. After stacking, you will start earning daily profits.
          </p>
        </motion.div>

        {/* Deposit & Withdraw */}
        <div className="mb-3 grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={() => navigate('/deposit')}
            whileTap={{ scale: 0.98 }}
            className="action-card card-dark glow-purple flex items-center gap-3 p-3 text-left"
          >
            <DepositNeonIcon size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Deposit</p>
              <p className="text-[9px] text-gray-500">Add funds to your account</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-gray-600" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => navigate('/withdraw')}
            whileTap={{ scale: 0.98 }}
            className="action-card card-dark glow-orange flex items-center gap-3 p-3 text-left"
          >
            <WithdrawNeonIcon size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Withdraw</p>
              <p className="text-[9px] text-gray-500">Withdraw your earnings</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-gray-600" />
          </motion.button>
        </div>

        {/* Pending */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="pending-card card-dark glow-red flex items-center gap-2.5 p-3">
            <PendingDepositNeonIcon size="sm" />
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400">Pending Deposits</p>
              <p className="text-sm font-bold text-cs-red">
                ${(data?.pending_deposits?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[8px] font-medium text-cs-red/80">
                {data?.pending_deposits?.count || 0} Requests
              </p>
            </div>
          </div>

          <div className="pending-card card-dark glow-gold flex items-center gap-2.5 p-3">
            <PendingWithdrawNeonIcon size="sm" />
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400">Pending Withdrawals</p>
              <p className="text-sm font-bold text-cs-gold">
                ${(data?.pending_withdrawals?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[8px] font-medium text-cs-gold/80">
                {data?.pending_withdrawals?.count || 0} Request
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <StatCard
            title="Total Balance"
            value={parseFloat(profile?.total_balance || 0)}
            color="purple"
            trend={data?.stats_trends?.balance}
            index={0}
            subValue={totalBtcEquivalent ? `≈ ${totalBtcEquivalent} BTC` : null}
          />
          <StatCard title="Total Deposit" value={parseFloat(profile?.total_deposit || 0)} color="green" trend={data?.stats_trends?.deposit} index={1} subValue="All Time" />
          <StatCard title="Total Withdraw" value={parseFloat(profile?.total_withdraw || 0)} color="orange" trend={data?.stats_trends?.withdraw} index={2} subValue="All Time" />
          <StatCard title="Total Profit" value={parseFloat(profile?.total_profit || 0)} color="red" trend={data?.stats_trends?.profit} index={3} subValue="All Time" />
        </div>

        {/* Refer & Earn */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-dark glow-purple mb-4 overflow-hidden p-4"
        >
          <div className="flex gap-4">
            {/* Left */}
            <div className="min-w-0 flex-1">
              <div className="refer-gift-area mb-3 flex h-20 items-center justify-center rounded-xl">
                <GiftNeonIcon size="md" />
              </div>
              <p className="mb-2 text-[10px] text-gray-400">Your Referral Code</p>
              <div className="mb-3 flex gap-2">
                <div className="flex-1 rounded-xl border border-cs-border bg-cs-dark px-3 py-2 font-mono text-sm font-bold text-cs-gold">
                  {profile?.referral_code || '------'}
                </div>
                <button
                  type="button"
                  onClick={copyReferral}
                  className="flex items-center gap-1 rounded-xl border border-cs-purple/30 bg-cs-purple/15 px-3 text-xs font-semibold text-cs-purple"
                >
                  <Copy size={13} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <button
                type="button"
                onClick={inviteFriends}
                className="gradient-btn-cta flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white"
              >
                <Share2 size={16} /> Invite Friends
              </button>
            </div>

            {/* Right stats */}
            <div className="w-[42%] shrink-0 border-l border-cs-border/50 pl-3">
              <div className="mb-3 space-y-2">
                <div>
                  <p className="text-base font-bold text-cs-purple">{profile?.total_referrals || 0}</p>
                  <p className="text-[8px] text-gray-500">Total Referrals</p>
                </div>
                <div>
                  <p className="text-base font-bold text-cs-green">{profile?.active_referrals || 0}</p>
                  <p className="text-[8px] text-gray-500">Active Referrals</p>
                </div>
                <div>
                  <p className="text-base font-bold text-cs-gold">${parseFloat(profile?.total_referral_bonus || 0).toFixed(2)}</p>
                  <p className="text-[8px] text-gray-500">Referral Bonus</p>
                </div>
              </div>
              {data?.referral_levels?.map((level) => {
                const levelColors = ['purple', 'blue', 'green'];
                const variant = levelColors[(level.level - 1) % 3];
                return (
                  <div key={level.level} className="flex items-center justify-between border-t border-cs-border/50 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <ReferralNeonIcon variant={variant} size="sm" />
                      <span className="text-[9px] text-gray-400">Level {level.level}</span>
                    </div>
                    <span className="text-[9px] font-semibold text-cs-green">${level.earnings.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* BTC/USDT Live Trade */}
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
            <div className="mb-3 flex flex-wrap gap-3 text-[10px] text-gray-500">
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
                  timeframe === tf
                    ? 'bg-cs-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    : 'bg-cs-dark text-gray-500 hover:text-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {/* Live Trades */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="mb-1 text-[9px] font-medium text-gray-500">Live Trades</p>
              {market?.live_trades?.length > 0 ? market.live_trades.slice(0, 5).map((trade, i) => (
                <div key={i} className="flex justify-between gap-1 border-b border-cs-border/30 py-1 text-[9px]">
                  <span className={`font-semibold ${trade.type === 'BUY' ? 'text-cs-green' : 'text-cs-red'}`}>
                    {trade.type}
                  </span>
                  <span className="text-gray-300">{Number(trade.price).toLocaleString()}</span>
                  <span className="text-gray-500">{trade.amount}</span>
                  <span className="text-gray-600">{formatTradeTime(trade.time)}</span>
                </div>
              )) : (
                <p className="py-2 text-center text-[9px] text-gray-500">No live trades</p>
              )}
            </div>

            {/* Full Chart button */}
            <div className="flex w-[38%] shrink-0 flex-col justify-end">
              <button
                type="button"
                onClick={() => loadMarket(timeframe)}
                className="gradient-btn-cta flex h-full min-h-[80px] flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-bold text-white"
              >
                <Maximize2 size={18} />
                Full Chart
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer features */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {[
            { Icon: SecureNeonIcon, label: 'Secure & Safe', sub: 'Bank-level security' },
            { Icon: ProfitsNeonIcon, label: 'Daily Profits', sub: 'Earn consistent returns' },
            { Icon: InstantNeonIcon, label: 'Instant Withdraw', sub: 'Withdraw anytime' },
            { Icon: SupportNeonIcon, label: '24/7 Support', sub: 'Always here to help' },
          ].map(({ Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex flex-col items-center rounded-xl border border-cs-border/40 bg-cs-card/40 p-2 text-center"
            >
              <Icon size="sm" className="mb-1.5" />
              <p className="text-[8px] font-semibold">{label}</p>
              <p className="text-[7px] text-gray-600">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

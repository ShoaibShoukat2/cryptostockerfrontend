import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { userAPI } from '../api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { WithdrawNeonIcon } from '../components/DashboardIcons';

const statusStyle = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  approved: 'text-cs-green bg-cs-green/10',
  rejected: 'text-cs-red bg-cs-red/10',
};

const BASE_RULES = [
  'You cannot submit 2 withdrawals at once. Wait until your first withdrawal is completed.',
  'Withdrawals are processed within 24–72 hours.',
  'You can withdraw your profit anytime.',
  'Minimum withdrawal amount is $20.',
];

export default function Withdraw() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('BEP20');
  const [walletAddress, setWalletAddress] = useState('');
  const [minWithdraw, setMinWithdraw] = useState(20);
  const [lockDays, setLockDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const withdrawable = parseFloat(user?.withdrawable_balance ?? user?.available_balance ?? 0);
  const locked = parseFloat(user?.locked_investment ?? 0);
  const hasPending = withdrawals.some((w) => w.status === 'pending');
  const rules = [
    ...BASE_RULES.slice(0, 3),
    `Investment is locked for ${lockDays} days — you cannot withdraw deposited amount for ${lockDays} days.`,
    ...BASE_RULES.slice(3),
  ];

  const loadWithdrawals = async () => {
    try {
      const { data } = await userAPI.getWithdrawals();
      setWithdrawals(data);
    } catch {
      setWithdrawals([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    loadWithdrawals();
    userAPI.getSiteConfig().then(({ data }) => {
      setMinWithdraw(parseFloat(data.min_withdraw || 20));
      setLockDays(parseInt(data.investment_lock_days || 30, 10));
    }).catch(() => {});
  }, [refreshUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await userAPI.createWithdrawal({
        amount: parseFloat(amount),
        network,
        wallet_address: walletAddress,
      });
      setSuccess(`Withdrawal request submitted via ${network}! Processing time: 24–72 hours.`);
      setAmount('');
      setNetwork('BEP20');
      setWalletAddress('');
      await loadWithdrawals();
      await refreshUser();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.amount?.[0] || 'Withdrawal failed';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />

        <div className="card-dark page-card-withdraw mb-4 p-6">
          <div className="mb-4 flex items-center gap-3">
            <WithdrawNeonIcon size="lg" />
            <div>
              <h2 className="text-xl font-bold text-cs-orange">Withdraw Funds</h2>
              <p className="text-sm text-gray-400">Min withdrawal ${minWithdraw}</p>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-cs-green/30 bg-cs-green/10 p-3">
              <p className="text-[10px] text-gray-500">Withdrawable</p>
              <p className="text-lg font-bold text-cs-green">${withdrawable.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-cs-border bg-cs-dark p-3">
              <p className="text-[10px] text-gray-500">Locked ({lockDays} days)</p>
              <p className="text-lg font-bold text-cs-gold">${locked.toFixed(2)}</p>
            </div>
          </div>

          {hasPending && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              You have a pending withdrawal. Please wait until it is completed before submitting another.
            </div>
          )}

          <div className="mb-4 rounded-xl border border-cs-border/50 bg-cs-dark/60 p-4">
            <p className="mb-2 text-xs font-bold text-gray-300">Withdrawal Rules</p>
            <ul className="space-y-1.5">
              {rules.map((rule) => (
                <li key={rule} className="flex gap-2 text-[10px] leading-relaxed text-gray-500">
                  <span className="text-cs-orange">•</span> {rule}
                </li>
              ))}
            </ul>
          </div>

          {success && (
            <div className="mb-4 rounded-lg border border-cs-green/30 bg-cs-green/10 p-3 text-sm text-cs-green">{success}</div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-gray-400">Select Network</label>
              <div className="flex gap-2">
                {['BEP20', 'TRC20'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNetwork(n)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${
                      network === n
                        ? 'border-cs-orange bg-cs-orange/20 text-cs-orange'
                        : 'border-cs-border text-gray-500'
                    }`}
                    disabled={hasPending}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min={minWithdraw}
                max={withdrawable}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-lg font-bold focus:border-cs-orange focus:outline-none"
                placeholder="20.00"
                required
                disabled={hasPending}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Wallet Address ({network} USDT)
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 font-mono text-sm focus:border-cs-orange focus:outline-none"
                placeholder={network === 'BEP20' ? 'Enter BEP20 (BSC) wallet address' : 'Enter TRC20 (TRON) wallet address'}
                required
                disabled={hasPending}
              />
            </div>
            <button
              type="submit"
              disabled={loading || hasPending}
              className="gradient-btn w-full rounded-xl py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Submitting...' : hasPending ? 'Pending Withdrawal Active' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        <div className="card-dark p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={18} className="text-cs-orange" />
            <h3 className="font-bold">Withdrawal History</h3>
          </div>
          {historyLoading ? (
            <p className="py-4 text-center text-sm text-gray-500">Loading...</p>
          ) : withdrawals.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No withdrawals yet</p>
          ) : (
            <div className="space-y-2">
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between border-b border-cs-border/50 py-3">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="mb-0.5 flex items-center gap-2">
                      <p className="text-sm font-semibold text-cs-orange">${parseFloat(w.amount).toFixed(2)}</p>
                      <span className="rounded bg-cs-orange/15 px-1.5 py-0.5 text-[9px] font-bold text-cs-orange">
                        {w.network || 'BEP20'}
                      </span>
                    </div>
                    <p className="truncate font-mono text-[10px] text-gray-500">{w.wallet_address}</p>
                    <p className="text-[10px] text-gray-500">{new Date(w.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[w.status]}`}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

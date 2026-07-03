import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
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

export default function Withdraw() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

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
  }, [refreshUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await userAPI.createWithdrawal({
        amount: parseFloat(amount),
        wallet_address: walletAddress,
      });
      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
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

        <div className="card-dark glow-orange mb-4 p-6">
          <div className="mb-4 flex items-center gap-3">
            <WithdrawNeonIcon size="lg" />
            <div>
              <h2 className="text-xl font-bold">Withdraw Funds</h2>
              <p className="text-sm text-gray-500">Withdraw your earnings</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-cs-border bg-cs-dark p-3">
            <p className="text-xs text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-cs-green">
              ${parseFloat(user?.available_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {success && (
            <div className="mb-4 rounded-lg border border-cs-green/30 bg-cs-green/10 p-3 text-sm text-cs-green">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={user?.available_balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-lg font-bold focus:border-cs-orange focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 font-mono text-sm focus:border-cs-orange focus:outline-none"
                placeholder="Enter your crypto wallet address"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full rounded-xl py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
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
                    <p className="text-sm font-semibold text-cs-orange">${parseFloat(w.amount).toFixed(2)}</p>
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

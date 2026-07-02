import { useState, useEffect } from 'react';
import { ArrowDownToLine, Clock } from 'lucide-react';
import { userAPI } from '../api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

const statusStyle = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  approved: 'text-cs-green bg-cs-green/10',
  rejected: 'text-cs-red bg-cs-red/10',
};

export default function Deposit() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadDeposits = async () => {
    try {
      const { data } = await userAPI.getDeposits();
      setDeposits(data);
    } catch {
      setDeposits([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    loadDeposits();
  }, [refreshUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await userAPI.createDeposit({ amount: parseFloat(amount), note });
      setSuccess('Deposit request submitted successfully!');
      setAmount('');
      setNote('');
      await loadDeposits();
      await refreshUser();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.amount?.[0] || 'Deposit failed';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />

        <div className="card-dark glow-purple mb-4 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cs-purple/20">
              <ArrowDownToLine size={24} className="text-cs-purple" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Deposit Funds</h2>
              <p className="text-sm text-gray-500">Add funds to your account</p>
            </div>
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-lg font-bold focus:border-cs-purple focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-sm focus:border-cs-purple focus:outline-none"
                rows={3}
                placeholder="Transaction reference..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full rounded-xl py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </form>

          <p className="mt-4 text-center text-[10px] text-gray-600">
            Deposits are reviewed by admin and typically processed within 24 hours.
          </p>
        </div>

        <div className="card-dark p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={18} className="text-cs-purple" />
            <h3 className="font-bold">Deposit History</h3>
          </div>
          {historyLoading ? (
            <p className="py-4 text-center text-sm text-gray-500">Loading...</p>
          ) : deposits.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No deposits yet</p>
          ) : (
            <div className="space-y-2">
              {deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between border-b border-cs-border/50 py-3">
                  <div>
                    <p className="text-sm font-semibold text-cs-green">${parseFloat(d.amount).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500">{new Date(d.created_at).toLocaleString()}</p>
                    <p className="font-mono text-[9px] text-gray-600">{d.transaction_id?.slice(0, 8)}...</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[d.status]}`}>
                    {d.status}
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

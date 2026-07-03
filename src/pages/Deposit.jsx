import { useState, useEffect } from 'react';
import { Clock, Copy, Upload } from 'lucide-react';
import { userAPI } from '../api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { DepositNeonIcon } from '../components/DashboardIcons';

const statusStyle = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  approved: 'text-cs-green bg-cs-green/10',
  rejected: 'text-cs-red bg-cs-red/10',
};

export default function Deposit() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [network, setNetwork] = useState('BEP20');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState('');
  const [config, setConfig] = useState({ min_deposit: 100, bep20_address: '', trc20_address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copied, setCopied] = useState('');

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
    userAPI.getSiteConfig().then(({ data }) => setConfig(data)).catch(() => {});
  }, [refreshUser]);

  const copyAddress = (addr, key) => {
    navigator.clipboard.writeText(addr);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('amount', parseFloat(amount));
      formData.append('network', network);
      if (note) formData.append('note', note);
      if (screenshot) formData.append('screenshot', screenshot);
      await userAPI.createDeposit(formData);
      setSuccess('Deposit request submitted successfully!');
      setAmount('');
      setNote('');
      setScreenshot(null);
      setPreview('');
      await loadDeposits();
      await refreshUser();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.amount?.[0] || 'Deposit failed';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  const depositAddress = network === 'BEP20' ? config.bep20_address : config.trc20_address;

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />

        <div className="card-dark glow-purple mb-4 p-6">
          <div className="mb-6 flex items-center gap-3">
            <DepositNeonIcon size="lg" />
            <div>
              <h2 className="text-xl font-bold">Deposit Funds</h2>
              <p className="text-sm text-gray-500">Minimum deposit ${config.min_deposit || 100}</p>
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            {['BEP20', 'TRC20'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNetwork(n)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${
                  network === n
                    ? 'border-cs-purple bg-cs-purple/20 text-cs-purple'
                    : 'border-cs-border text-gray-500'
                }`}
              >
                {n} USDT
              </button>
            ))}
          </div>

          {depositAddress && (
            <div className="mb-4 rounded-xl border border-cs-border bg-cs-dark p-3">
              <p className="mb-1 text-[10px] text-gray-500">{network} Deposit Address</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 break-all font-mono text-xs text-cs-gold">{depositAddress}</p>
                <button
                  type="button"
                  onClick={() => copyAddress(depositAddress, network)}
                  className="shrink-0 rounded-lg bg-cs-purple/20 p-2 text-cs-purple"
                >
                  <Copy size={14} />
                </button>
              </div>
              {copied === network && <p className="mt-1 text-[10px] text-cs-green">Copied!</p>}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-cs-green/30 bg-cs-green/10 p-3 text-sm text-cs-green">{success}</div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Amount (USD) — Min ${config.min_deposit || 100}</label>
              <input
                type="number"
                step="0.01"
                min={config.min_deposit || 100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-lg font-bold focus:border-cs-purple focus:outline-none"
                placeholder="100.00"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-400">Payment Screenshot</label>
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-cs-border bg-cs-dark/60 p-4 hover:border-cs-purple/50">
                {preview ? (
                  <img src={preview} alt="Screenshot" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <Upload size={24} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Upload transaction screenshot</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-400">Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-4 py-3 text-sm focus:border-cs-purple focus:outline-none"
                rows={2}
                placeholder="Transaction hash / reference..."
              />
            </div>
            <button type="submit" disabled={loading} className="gradient-btn w-full rounded-xl py-3 font-bold text-white disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </form>

          <p className="mt-4 text-center text-[10px] text-gray-600">
            Send USDT to the address above, upload screenshot, then submit. Reviewed within 24 hours.
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
                    <p className="text-[10px] text-gray-500">{d.network} · {new Date(d.created_at).toLocaleString()}</p>
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

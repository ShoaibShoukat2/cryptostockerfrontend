import { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { userAPI } from '../api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

const typeColors = {
  deposit: 'text-cs-green',
  withdraw: 'text-cs-orange',
  stack: 'text-cs-purple',
  profit: 'text-cs-gold',
  referral: 'text-cs-gold',
};

export default function Transactions() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getTransactions();
      setTransactions(data);
      setError('');
    } catch {
      setError('Failed to load transactions.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    loadTransactions();
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <div className="card-dark p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-cs-purple" />
              <h2 className="text-xl font-bold">Transactions</h2>
            </div>
            <button type="button" onClick={loadTransactions} className="text-xs text-cs-purple hover:underline">
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-cs-border/50 py-3">
                  <div>
                    <p className={`text-sm font-semibold capitalize ${typeColors[tx.type] || 'text-white'}`}>
                      {tx.type}
                    </p>
                    <p className="text-[10px] text-gray-500">{tx.description}</p>
                    <p className="text-[9px] text-gray-600">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                  <p className={`font-bold ${typeColors[tx.type] || 'text-white'}`}>
                    ${parseFloat(tx.amount).toFixed(2)}
                  </p>
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

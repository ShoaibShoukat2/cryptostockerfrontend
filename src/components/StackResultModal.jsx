import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import stackNowLogo from '../assets/stackNow.png';

export default function StackResultModal({ result, onClose }) {
  const navigate = useNavigate();

  if (!result) return null;

  const {
    stack_amount: stackAmount,
    profit_earned: profitEarned,
    profit_percent: profitPercent,
    previous_balance: previousBalance,
    new_balance: newBalance,
  } = result;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm overflow-hidden rounded-3xl border border-cs-green/30 bg-gradient-to-b from-[#0f1a10] to-[#0a0a0a] shadow-[0_0_40px_rgba(34,197,94,0.25)]"
        >
          <div className="relative bg-gradient-to-r from-cs-green/20 to-cs-purple/20 px-6 pb-5 pt-8 text-center">
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 text-gray-500 hover:text-white">
              <X size={18} />
            </button>
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-cs-purple/50 bg-black shadow-[0_0_24px_rgba(139,92,246,0.45)]">
              <img
                src={stackNowLogo}
                alt="Crypto Stacker"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <h2 className="text-xl font-bold text-white">Stack Successful!</h2>
            <p className="mt-1 text-3xl font-black text-cs-green">{profitPercent}</p>
            <p className="text-xs text-gray-400">Daily Profit Rate</p>
          </div>

          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between rounded-xl border border-cs-border/50 bg-cs-dark/80 px-4 py-3">
              <span className="text-xs text-gray-500">Investment Stacked</span>
              <span className="font-bold text-white">${stackAmount?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cs-green/30 bg-cs-green/10 px-4 py-3">
              <span className="flex items-center gap-1 text-xs text-cs-green">
                <TrendingUp size={14} /> Profit Earned
              </span>
              <span className="font-bold text-cs-green">+${profitEarned?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cs-border/50 bg-cs-dark/80 px-4 py-3">
              <span className="text-xs text-gray-500">Previous Balance</span>
              <span className="text-sm text-gray-400">${previousBalance?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cs-purple/30 bg-cs-purple/10 px-4 py-3">
              <span className="text-xs text-cs-purple">New Total Balance</span>
              <span className="text-lg font-bold text-white">${newBalance?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2 border-t border-cs-border/30 p-4">
            <button
              type="button"
              onClick={() => { onClose(); navigate('/transactions'); }}
              className="flex-1 rounded-xl border border-cs-border py-2.5 text-sm text-gray-300"
            >
              View History
            </button>
            <button
              type="button"
              onClick={onClose}
              className="gradient-btn-cta flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

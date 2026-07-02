import { motion } from 'framer-motion';
import { Shield, Zap, Headphones } from 'lucide-react';

export function AuthCard({ children, title, subtitle, icon: Icon, variant = 'purple' }) {
  const borderGlow = variant === 'orange'
    ? 'border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.08)]'
    : 'border-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]';

  return (
    <div className={`auth-glass-card relative overflow-hidden rounded-2xl border bg-gradient-to-b from-[#141414]/95 to-[#0a0a0a]/98 p-5 backdrop-blur-xl sm:p-7 ${borderGlow}`}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative mb-6 text-center"
      >
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 ring-1 ring-purple-500/30"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.25)' }}
          >
            <Icon size={22} className="text-purple-400" />
          </motion.div>
        )}
        <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </motion.div>

      {children}

      <AuthTrustBadges />
    </div>
  );
}

function AuthTrustBadges() {
  const badges = [
    { icon: Shield, label: 'Secure' },
    { icon: Zap, label: 'Fast' },
    { icon: Headphones, label: '24/7 Support' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-6 flex justify-center gap-4 border-t border-white/5 pt-5"
    >
      {badges.map(({ icon: Icon, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 + i * 0.08 }}
          className="flex flex-col items-center gap-1"
        >
          <Icon size={14} className="text-purple-400/80" />
          <span className="text-[9px] text-gray-600">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  icon: Icon,
  suffix,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + delay, duration: 0.4 }}
      className="min-w-0"
    >
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`auth-input w-full min-w-0 rounded-xl border border-white/8 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-600 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${Icon ? 'pl-10' : ''} ${suffix ? 'pr-11' : ''}`}
        />
        {suffix}
      </div>
    </motion.div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mb-4 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
    >
      {message}
    </motion.div>
  );
}

export function AuthSubmitButton({ loading, loadingText, children, icon: Icon, delay = 0 }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay }}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className="gradient-btn-cta mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white disabled:opacity-50"
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
        />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {loading ? loadingText : children}
    </motion.button>
  );
}
import { memo } from 'react';
import { Shield, Zap, Headphones } from 'lucide-react';

export function AuthCard({ children, title, subtitle, icon: Icon, variant = 'purple' }) {
  const borderGlow = variant === 'orange'
    ? 'border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.06)]'
    : 'border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.08)]';

  return (
    <div className={`auth-glass-card relative overflow-hidden rounded-2xl border bg-[#0d0d0d] p-5 sm:p-7 ${borderGlow}`}>
      <div className="relative mb-6 text-center">
        {Icon && (
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 ring-1 ring-purple-500/25">
            <Icon size={22} className="text-purple-400" />
          </div>
        )}
        <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

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
    <div className="mt-6 flex justify-center gap-4 border-t border-white/5 pt-5">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <Icon size={14} className="text-purple-400/80" />
          <span className="text-[9px] text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
}

export const AuthInput = memo(function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  icon: Icon,
  suffix,
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`auth-input w-full min-w-0 rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white placeholder:text-gray-600 transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 ${Icon ? 'pl-10' : ''} ${suffix ? 'pr-11' : ''}`}
        />
        {suffix}
      </div>
    </div>
  );
});

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
      {message}
    </div>
  );
}

export function AuthSubmitButton({ loading, loadingText, children, icon: Icon }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="gradient-btn-cta mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition-opacity disabled:opacity-50"
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {loading ? loadingText : children}
    </button>
  );
}

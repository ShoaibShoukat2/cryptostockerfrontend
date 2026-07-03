import { memo } from 'react';
import { Logo } from './Logo';

const orbVariants = {
  purple: 'bg-purple-600/15',
  orange: 'bg-orange-500/12',
};

const AuthBackground = memo(function AuthBackground({ variant }) {
  const orb = orbVariants[variant] || orbVariants.purple;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute -left-20 top-1/4 h-64 w-64 rounded-full blur-3xl ${orb} auth-orb`} />
      <div className="absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-amber-500/8 blur-3xl auth-orb auth-orb-delayed" />
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  );
});

export default function AuthLayout({ children, variant = 'purple' }) {
  return (
    <div className="auth-page relative min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-cs-mesh">
      <AuthBackground variant={variant} />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="auth-fade-in mb-6 flex w-full flex-col items-center sm:mb-8">
          <Logo size="lg" centered showTagline={false} animate={false} />
          <div className="mt-3 h-px w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent sm:w-40" />
          <p className="mt-2 text-[10px] tracking-[0.3em] text-gray-500">
            STACK MORE · EARN MORE
          </p>
        </div>

        <div className="auth-fade-in-delayed w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

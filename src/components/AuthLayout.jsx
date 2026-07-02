import { motion } from 'framer-motion';
import { Logo } from './Logo';

const orbVariants = {
  purple: 'bg-purple-600/20',
  orange: 'bg-orange-500/15',
};

export default function AuthLayout({ children, variant = 'purple' }) {
  const orb = orbVariants[variant] || orbVariants.purple;

  return (
    <div className="auth-page relative min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-cs-mesh">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -left-20 top-1/4 h-64 w-64 rounded-full blur-3xl ${orb}`}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        />
        {/* Floating rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-purple-500/10"
            style={{
              width: 120 + i * 80,
              height: 120 + i * 80,
              left: `${15 + i * 25}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{ rotate: 360, opacity: [0.1, 0.25, 0.1] }}
            transition={{ rotate: { duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }, opacity: { duration: 4, repeat: Infinity } }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-4 py-8 sm:px-6">
        {/* Logo — centered above form */}
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex w-full flex-col items-center sm:mb-8"
        >
          <Logo size="lg" centered showTagline={false} />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 h-px w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent sm:w-40"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-[10px] tracking-[0.3em] text-gray-500"
          >
            STACK MORE · EARN MORE
          </motion.p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

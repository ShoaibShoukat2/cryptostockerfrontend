import { motion } from 'framer-motion';
import { Logo } from './Logo';

export default function AuthLayout({ children, variant = 'purple' }) {
  const accent = variant === 'orange'
    ? 'bg-cs-orange/10'
    : 'bg-cs-purple/10';

  return (
    <div className="min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-cs-mesh">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 h-48 w-48 rounded-full blur-3xl sm:h-64 sm:w-64 ${accent}`} />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-cs-gold/10 blur-3xl sm:h-64 sm:w-64" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full min-w-0"
        >
          <div className="mb-6 sm:mb-8">
            <Logo size="lg" />
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

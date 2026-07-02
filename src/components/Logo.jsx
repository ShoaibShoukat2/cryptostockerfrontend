import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpeg';

const sizeMap = {
  lg: 'max-w-[280px] sm:max-w-[340px]',
  md: 'max-w-[200px] sm:max-w-[240px]',
  sm: 'max-w-[140px] sm:max-w-[160px]',
  xs: 'max-w-[100px]',
};

export function Logo({ size = 'md', centered = true, showTagline = true, animate = true }) {
  const maxW = sizeMap[size] || sizeMap.md;

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: -12, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`${centered ? 'mx-auto' : ''} w-full ${maxW} px-1`}
    >
      <div className="logo-glow-wrap relative">
        <div className="logo-ring logo-ring-purple" aria-hidden="true" />
        <div className="logo-ring logo-ring-gold" aria-hidden="true" />

        <motion.div
          className="relative overflow-hidden rounded-2xl"
          animate={animate ? { y: [0, -4, 0] } : undefined}
          transition={animate ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <img
            src={logoImg}
            alt="Crypto Stacker"
            className="logo-img relative z-10 w-full object-contain"
            draggable={false}
          />
          {animate && <div className="logo-shimmer" aria-hidden="true" />}
        </motion.div>
      </div>

      {showTagline && (
        <motion.p
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={animate ? { delay: 0.4, duration: 0.5 } : undefined}
          className="mt-2 text-center text-[9px] font-medium tracking-[0.25em] text-gray-400 sm:text-[10px] sm:tracking-[0.35em]"
        >
          STACK MORE. EARN MORE.
        </motion.p>
      )}
    </Wrapper>
  );
}

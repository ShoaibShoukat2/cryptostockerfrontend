import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpeg';

const sizeMap = {
  lg: 'h-24 w-auto max-w-[240px] sm:h-28 sm:max-w-[280px]',
  md: 'h-14 w-auto max-w-[150px] sm:h-16 sm:max-w-[170px]',
  sm: 'h-10 w-auto max-w-[110px]',
  xs: 'h-8 w-auto max-w-[90px]',
};

export function Logo({ size = 'md', centered = true, showTagline = false, animate = true }) {
  const imgSize = sizeMap[size] || sizeMap.md;

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: -8, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`${centered ? 'mx-auto' : ''} inline-block`}
    >
      <div className="logo-glow-wrap relative inline-block">
        <div className="logo-ring logo-ring-purple" aria-hidden="true" />
        <div className="logo-ring logo-ring-gold" aria-hidden="true" />

        <motion.div
          className="relative inline-block overflow-hidden rounded-xl"
          animate={animate ? { y: [0, -2, 0] } : undefined}
          transition={animate ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <img
            src={logoImg}
            alt="Crypto Stacker"
            className={`logo-img relative z-10 object-contain ${imgSize}`}
            draggable={false}
          />
          {animate && <div className="logo-shimmer" aria-hidden="true" />}
        </motion.div>
      </div>

      {showTagline && (
        <motion.p
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={animate ? { delay: 0.3, duration: 0.4 } : undefined}
          className="mt-1.5 text-center text-[8px] font-medium tracking-[0.2em] text-gray-500 sm:text-[9px]"
        >
          STACK MORE. EARN MORE.
        </motion.p>
      )}
    </Wrapper>
  );
}

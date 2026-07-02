import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedValue({
  value = 0,
  prefix = '$',
  decimals = 2,
  className = '',
}) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  );
  const [text, setText] = useState(`${prefix}0.00`);
  const started = useRef(false);

  useEffect(() => {
    spring.set(num);
    if (!started.current) started.current = true;
  }, [num, spring]);

  useEffect(() => {
    const unsub = display.on('change', (v) => setText(v));
    return unsub;
  }, [display]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.span>
  );
}

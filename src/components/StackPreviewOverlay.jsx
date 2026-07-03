import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function playTone(freq, duration = 0.12, volume = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* audio not available */
  }
}

function playSuccessSound() {
  playTone(523, 0.15, 0.2);
  setTimeout(() => playTone(659, 0.15, 0.2), 120);
  setTimeout(() => playTone(784, 0.25, 0.25), 240);
}

export default function StackPreviewOverlay({ active, onComplete, balance, profitPercent }) {
  const [count, setCount] = useState(10);
  const intervalRef = useRef(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!active) {
      setCount(10);
      cleanup();
      return undefined;
    }

    setCount(10);
    playTone(440, 0.08, 0.12);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          cleanup();
          playSuccessSound();
          setTimeout(onComplete, 400);
          return 0;
        }
        playTone(300 + (10 - prev) * 40, 0.1, 0.15);
        return prev - 1;
      });
    }, 1000);

    return cleanup;
  }, [active, onComplete, cleanup]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-sm rounded-3xl border border-cs-purple/40 bg-gradient-to-b from-[#1a1030] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(139,92,246,0.4)]"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-cs-purple">Stacking Balance</p>
            <p className="mb-6 text-sm text-gray-400">
              ${parseFloat(balance || 0).toFixed(2)} @ {profitPercent || '1.4%'} daily
            </p>

            <motion.div
              key={count}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center"
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-cs-purple/20" />
              <div className="absolute inset-2 rounded-full border-4 border-cs-purple/50 bg-cs-purple/10" />
              <span className="relative text-7xl font-black text-white tabular-nums">{count}</span>
            </motion.div>

            <p className="text-xs text-gray-500">Please wait while your stack is processing...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

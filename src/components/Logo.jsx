export function Logo({ size = 'md' }) {
  const textSize = {
    lg: 'text-2xl sm:text-3xl md:text-4xl',
    md: 'text-xl sm:text-2xl',
    sm: 'text-base sm:text-lg',
  }[size] || 'text-xl sm:text-2xl';

  return (
    <div className="w-full px-2 text-center">
      <h1 className={`${textSize} font-black leading-tight tracking-wide sm:tracking-wider`}>
        <span
          className="text-cs-purple"
          style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}
        >
          CRYPTO
        </span>
        <span className="mx-1 hidden sm:inline" />
        <span
          className="text-cs-gold"
          style={{ textShadow: '0 0 20px rgba(245,158,11,0.5)' }}
        >
          STACKER
        </span>
      </h1>
      <p className="mt-1 text-[9px] tracking-[0.2em] text-gray-500 sm:text-[10px] sm:tracking-[0.3em]">
        STACK MORE. EARN MORE.
      </p>
    </div>
  );
}

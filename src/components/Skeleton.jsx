export function Skeleton({ className = "" }) {
    return (
      <div
        className={`animate-pulse rounded-xl bg-white/10 border border-white/10 ${className}`}
      />
    );
  }
  
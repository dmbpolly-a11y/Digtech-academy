import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  colorClassName?: string;
}

export function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 6,
  label,
  className,
  colorClassName = 'text-action'
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="text-brand-light" stroke="currentColor" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
           className={cn(colorClassName, 'transition-[stroke-dashoffset] duration-700 ease-in-out')}
          stroke="currentColor"
          fill="none"
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-ink">
        {label ?? `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}

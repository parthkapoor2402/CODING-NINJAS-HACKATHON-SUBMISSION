import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrustScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 48, md: 72, lg: 96 };

export function TrustScoreRing({ score, size = 'md', className }: TrustScoreRingProps) {
  const dim = sizeMap[size];
  const color =
    score >= 70 ? 'text-civic-teal-500' : score >= 40 ? 'text-civic-amber-500' : 'text-civic-coral-500';

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
      aria-label={`Trust score ${score}`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-muted"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={color}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${score}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className={cn('font-display text-lg font-bold', color)}>{score}</span>
    </div>
  );
}

export function TrustBadge({ score }: { score: number }) {
  const label = score >= 70 ? 'Trusted' : score >= 40 ? 'Building trust' : 'Review needed';
  const variant = score >= 70 ? 'verified' : score >= 40 ? 'pending' : 'rejected';
  return <Badge variant={variant}>{label}</Badge>;
}

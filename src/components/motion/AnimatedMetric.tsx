import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { cn } from '@/lib/utils';

interface AnimatedMetricProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedMetric({ value, className, suffix, prefix }: AnimatedMetricProps) {
  const display = useAnimatedNumber(value);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

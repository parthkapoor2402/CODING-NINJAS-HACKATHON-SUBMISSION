import { ChevronLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showBrand?: boolean;
  transparent?: boolean;
  className?: string;
  trailing?: React.ReactNode;
  showNotifications?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  showBack,
  onBack,
  showBrand = false,
  transparent = false,
  className,
  trailing,
  showNotifications = false,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex min-h-[52px] items-center gap-3 px-4 py-3 safe-top',
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-b border-border/60 bg-background/90 backdrop-blur-md',
        className,
      )}
    >
      {showBack ? (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      ) : null}

      <div className="min-w-0 flex-1">
        {showBrand ? (
          <p className="font-display text-lg font-bold tracking-tight text-civic-blue-600">
            CivicResolve
          </p>
        ) : null}
        {title ? (
          <h1 className="truncate font-display text-lg font-bold tracking-tight">{title}</h1>
        ) : null}
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {showNotifications ? (
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        ) : null}
        {trailing}
      </div>
    </header>
  );
}

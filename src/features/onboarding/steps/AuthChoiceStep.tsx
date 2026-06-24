import { Button } from '@/components/ui/button';
import { UserCircle, LogIn, Lock } from 'lucide-react';
import { GUEST_LIMITATIONS } from '@/features/onboarding/onboarding-config';

interface AuthChoiceStepProps {
  onGuest: () => void;
  onSignIn: () => void;
  loading?: boolean;
}

export function AuthChoiceStep({ onGuest, onSignIn, loading }: AuthChoiceStepProps) {
  return (
    <div className="space-y-5" data-testid="auth-choice-step">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">How would you like to continue?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Guest mode lets you explore. Sign in saves your trust score and reports across devices.
        </p>
      </div>

      <div className="rounded-xl border border-civic-amber-200/80 bg-civic-amber-50/50 p-4" data-testid="guest-limitations">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
          <Lock className="h-4 w-4" />
          Guest mode includes
        </div>
        <ul className="space-y-1.5 text-xs leading-relaxed text-amber-900/90">
          {GUEST_LIMITATIONS.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-civic-amber-600">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="civic"
        size="lg"
        className="w-full"
        data-testid="guest-continue"
        disabled={loading}
        onClick={onGuest}
      >
        <UserCircle className="h-5 w-5" />
        Continue as guest
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full border-civic-blue-200"
        data-testid="sign-in-continue"
        disabled={loading}
        onClick={onSignIn}
      >
        <LogIn className="h-5 w-5" />
        Sign in to my account
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Signing in unlocks full trust tracking, rewards, and cross-device history.
      </p>
    </div>
  );
}

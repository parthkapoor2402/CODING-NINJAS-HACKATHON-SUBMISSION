import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Shield, Users, LogIn, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DEMO_ACCOUNTS, ROUTES, APP_NAME } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';

const demoButtons: { label: string; email: string; primary?: boolean }[] = [
  { label: 'Continue as citizen', email: DEMO_ACCOUNTS.citizen, primary: true },
  { label: 'Admin demo', email: DEMO_ACCOUNTS.admin },
  { label: 'Youth demo', email: DEMO_ACCOUNTS.youth },
  { label: 'Parent demo', email: DEMO_ACCOUNTS.parent },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const authPath = useOnboardingStore((s) => s.authPath);
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const session = useAuthStore((s) => s.session);

  if (onboardingComplete && session) {
    const isAdmin =
      session.user.role === 'admin' || session.user.role === 'moderator';
    return (
      <Navigate to={isAdmin ? ROUTES.admin.dashboard : ROUTES.home} replace />
    );
  }

  const handleDemo = async (email: string) => {
    await signIn(email);
    if (authPath === 'sign-in' || !onboardingComplete) {
      completeOnboarding();
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background" data-testid="auth-page">
      <div className="gradient-civic-hero relative overflow-hidden px-6 pb-20 pt-14 text-white">
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mx-auto max-w-md animate-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted civic action
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{APP_NAME}</h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-white/90">
            Sign in to save your trust score, track resolutions, and earn recognition for verified contribution.
          </p>
        </div>
      </div>

      <div className="-mt-12 flex flex-1 flex-col px-4 pb-8">
        <Card className="mx-auto w-full max-w-md border-0 shadow-elevated animate-scale-in">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start gap-3 rounded-xl bg-civic-blue-50 p-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-civic-blue-600" />
              <p className="text-sm leading-relaxed text-civic-blue-900">
                Demo sign-in — no password. Your account unlocks full trust tracking and rewards.
              </p>
            </div>

            <div className="space-y-2" data-testid="sign-in-options">
              {demoButtons.map(({ label, email, primary }) => (
                <Button
                  key={email}
                  variant={primary ? 'civic' : 'outline'}
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleDemo(email)}
                >
                  {primary ? <LogIn className="h-4 w-4" /> : null}
                  {label}
                </Button>
              ))}
            </div>

            {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

            {!onboardingComplete ? (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate(ROUTES.onboarding)}
              >
                <Users className="h-4 w-4" />
                New here? Take the tour
              </Button>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Prefer to browse first?{' '}
                <Link to={ROUTES.onboarding} className="font-semibold text-civic-blue-600">
                  Return to onboarding
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <p className="mx-auto mt-8 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
          By continuing, you agree to report responsibly and support existing issues when possible.
        </p>
      </div>
    </div>
  );
}

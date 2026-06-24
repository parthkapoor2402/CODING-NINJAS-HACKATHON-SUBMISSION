import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/features/onboarding/OnboardingLayout';
import { PersonaStepConnected } from '@/features/onboarding/steps/PersonaStep';
import { PermissionEducationStep } from '@/features/onboarding/steps/PermissionEducationStep';
import { AuthChoiceStep } from '@/features/onboarding/steps/AuthChoiceStep';
import { ONBOARDING_STEPS } from '@/features/onboarding/onboarding-config';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';
import type { PermissionType } from '@/types/onboarding';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const persona = useOnboardingStore((s) => s.persona);
  const permissions = useOnboardingStore((s) => s.permissions);
  const acknowledgePermission = useOnboardingStore((s) => s.acknowledgePermission);
  const setAuthPath = useOnboardingStore((s) => s.setAuthPath);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const signInAsGuest = useAuthStore((s) => s.signInAsGuest);
  const session = useAuthStore((s) => s.session);
  const [guestLoading, setGuestLoading] = useState(false);

  if (onboardingComplete && session) {
    return <Navigate to={ROUTES.home} replace />;
  }

  const stepId = ONBOARDING_STEPS[stepIndex];
  const isPermissionStep = stepId === 'location' || stepId === 'camera' || stepId === 'notifications';
  const permissionType = isPermissionStep ? (stepId as PermissionType) : null;

  const canContinue =
    stepId === 'persona'
      ? persona !== null
      : stepId === 'auth'
        ? false
        : isPermissionStep
          ? permissions[permissionType!]
          : true;

  const handleContinue = () => {
    if (stepIndex < ONBOARDING_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    setAuthPath('guest');
    await signInAsGuest();
    completeOnboarding();
    navigate(ROUTES.home, { replace: true });
    setGuestLoading(false);
  };

  const handleSignIn = () => {
    setAuthPath('sign-in');
    navigate(ROUTES.auth);
  };

  const footer =
    stepId !== 'auth' ? (
      <Button
        variant="civic"
        size="xl"
        className="w-full"
        data-testid="onboarding-continue"
        disabled={!canContinue}
        onClick={handleContinue}
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </Button>
    ) : undefined;

  return (
    <div data-testid="onboarding-flow">
      <OnboardingLayout stepIndex={stepIndex} totalSteps={ONBOARDING_STEPS.length} footer={footer}>
        {stepId === 'persona' ? <PersonaStepConnected /> : null}
        {permissionType ? (
          <PermissionEducationStep
            type={permissionType}
            acknowledged={permissions[permissionType]}
            onAcknowledge={() => acknowledgePermission(permissionType)}
          />
        ) : null}
        {stepId === 'auth' ? (
          <AuthChoiceStep onGuest={handleGuest} onSignIn={handleSignIn} loading={guestLoading} />
        ) : null}
      </OnboardingLayout>
    </div>
  );
}

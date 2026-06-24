import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FirstSessionEducationCard } from '@/components/education/FirstSessionEducationCard';
import { useOnboardingStore } from '@/store/onboardingStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';

describe('FirstSessionEducationCard', () => {
  beforeEach(() => {
    clearOnboardingState();
    useOnboardingStore.getState().resetOnboarding();
    useOnboardingStore.getState().hydrate();
  });

  it('C24: shows for new users after onboarding', () => {
    useOnboardingStore.getState().completeOnboarding();
    render(
      <MemoryRouter>
        <FirstSessionEducationCard />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('first-session-education')).toBeInTheDocument();
    expect(screen.getByText(/Trust/i)).toBeInTheDocument();
    expect(screen.getByText(/Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/Rewards/i)).toBeInTheDocument();
  });

  it('C25: dismiss hides card and persists', () => {
    useOnboardingStore.getState().completeOnboarding();
    render(
      <MemoryRouter>
        <FirstSessionEducationCard />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Got it'));
    expect(screen.queryByTestId('first-session-education')).not.toBeInTheDocument();
    expect(useOnboardingStore.getState().firstSessionEducationSeen).toBe(true);
  });

  it('C26: hidden for returning users who dismissed', () => {
    useOnboardingStore.getState().completeOnboarding();
    useOnboardingStore.getState().dismissFirstSessionEducation();
    render(
      <MemoryRouter>
        <FirstSessionEducationCard />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('first-session-education')).not.toBeInTheDocument();
  });
});

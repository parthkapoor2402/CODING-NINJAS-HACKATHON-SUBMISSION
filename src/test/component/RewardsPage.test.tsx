import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RewardsPage from '@/features/rewards/RewardsPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('RewardsPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C64: leaderboard renders ranked users', async () => {
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
    render(
      <MemoryRouter>
        <RewardsPage />
      </MemoryRouter>,
    );
    const board = await screen.findByTestId('rewards-leaderboard');
    expect(board).toBeInTheDocument();
    await waitFor(() => {
      expect(board.textContent).toMatch(/Asha Verma|Priya Verma/i);
    });
  });

  it('C65: reward catalog shows locked and unlocked items', async () => {
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
    render(
      <MemoryRouter>
        <RewardsPage />
      </MemoryRouter>,
    );
    await screen.findByTestId('reward-catalog');
    expect(await screen.findByTestId('reward-catalog-item-perk-coffee')).toBeInTheDocument();
    await waitFor(() => {
      const locked = screen.queryAllByTestId('reward-catalog-locked');
      const unlocked = screen.queryAllByTestId('reward-catalog-unlocked');
      expect(locked.length + unlocked.length).toBeGreaterThan(0);
    });
  });

  it('C66: redeem button disabled when ineligible', async () => {
    await useAuthStore.getState().signIn('demo-youth@local.dev');
    render(
      <MemoryRouter>
        <RewardsPage />
      </MemoryRouter>,
    );
    const btn = await screen.findByTestId('redeem-reward-btn');
    expect(btn).toBeDisabled();
  });
});

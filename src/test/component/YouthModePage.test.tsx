import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import YouthModePage from '@/features/youth-mode/YouthModePage';

describe('YouthModePage', () => {
  it('C67: youth rewards restricted notice', () => {
    render(
      <MemoryRouter>
        <YouthModePage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('youth-rewards-restricted')).toBeInTheDocument();
    expect(screen.getByText(/cannot redeem partner perks/i)).toBeInTheDocument();
  });

  it('C68: family contributions safe list', async () => {
    render(
      <MemoryRouter>
        <YouthModePage />
      </MemoryRouter>,
    );
    const list = await screen.findByTestId('family-contributions');
    expect(list).toBeInTheDocument();
    await waitFor(() => {
      expect(list.textContent?.length).toBeGreaterThan(0);
    });
  });
});

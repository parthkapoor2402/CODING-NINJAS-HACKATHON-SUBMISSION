import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders verified label', () => {
    render(<StatusBadge status="verified" />);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });
});

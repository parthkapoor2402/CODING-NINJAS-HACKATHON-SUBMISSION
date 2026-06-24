import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

describe('useAnimatedNumber', () => {
  it('eventually reaches target value', async () => {
    const { result } = renderHook(() => useAnimatedNumber(42, 100));
    await waitFor(() => {
      expect(result.current).toBe(42);
    });
  });
});

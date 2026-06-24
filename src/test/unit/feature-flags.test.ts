import { describe, expect, it } from 'vitest';
import { featureFlags } from '@/lib/feature-flags';

describe('featureFlags', () => {
  it('defaults mocks on for MVP', () => {
    expect(featureFlags.useMocks).toBe(true);
  });

  it('enables youth mode scaffold', () => {
    expect(featureFlags.youthMode).toBe(true);
  });
});

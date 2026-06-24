import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocationStep } from '@/features/reporting/steps/LocationStep';
import {
  resetGeolocationAdapter,
  setGeolocationAdapter,
} from '@/lib/geolocation';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import { useReportDraftStore } from '@/store/reportDraftStore';

describe('ReportLocationStep', () => {
  beforeEach(() => {
    clearReportDraft();
    useReportDraftStore.getState().resetDraft();
    resetGeolocationAdapter();
    useReportDraftStore.getState().updateDraft({
      category: 'pothole',
      description: 'Test issue on road',
      step: 2,
    });
  });

  it('C34: location capture and pin adjust', async () => {
    setGeolocationAdapter({
      getCurrentPosition: async () => ({
        ok: true,
        location: { lat: 12.972, lng: 77.595, accuracyM: 10 },
      }),
    });
    render(<LocationStep />);
    await waitFor(() => {
      expect(screen.getByTestId('location-pin-display')).toHaveTextContent('12.97200');
    });
    const latInput = screen.getByLabelText(/latitude/i);
    fireEvent.change(latInput, { target: { value: '12.97500' } });
    expect(useReportDraftStore.getState().draft.location?.lat).toBeCloseTo(12.975, 4);
  });

  it('C45: denied location permission', async () => {
    setGeolocationAdapter({
      getCurrentPosition: async () => ({ ok: false, error: 'permission_denied' }),
    });
    render(<LocationStep />);
    await waitFor(() => {
      expect(screen.getByTestId('permission-denied-location')).toBeInTheDocument();
    });
    expect(screen.getByTestId('location-pin-adjust')).toBeInTheDocument();
    expect(useReportDraftStore.getState().draft.location).toBeDefined();
  });
});

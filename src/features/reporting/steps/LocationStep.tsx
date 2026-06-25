import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapPreviewCard } from '@/components/cards/MapPreviewCard';
import { duplicateTrustFromDraft } from '@/domain/duplicate-trust-local';
import { DEFAULT_PIN, getGeolocationAdapter } from '@/lib/geolocation';
import {
  analyzeDuplicateTrust,
  duplicateTrustToDraftUpdates,
} from '@/services/ai/duplicate-trust-agent';
import { useReportDraftStore } from '@/store/reportDraftStore';

export function LocationStep() {
  const location = useReportDraftStore((s) => s.draft.location);
  const category = useReportDraftStore((s) => s.draft.category);
  const description = useReportDraftStore((s) => s.draft.description);
  const title = useReportDraftStore((s) => s.draft.title);
  const mediaAttachments = useReportDraftStore((s) => s.draft.mediaAttachments);
  const textOnlyFallback = useReportDraftStore((s) => s.draft.textOnlyFallback);
  const severity = useReportDraftStore((s) => s.draft.severity);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const setDuplicateWarning = useReportDraftStore((s) => s.setDuplicateWarning);
  const setStep = useReportDraftStore((s) => s.setStep);

  const [locationDenied, setLocationDenied] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const pin = location ?? DEFAULT_PIN;

  useEffect(() => {
    if (!location) {
      void captureLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureLocation = async () => {
    setCapturing(true);
    const result = await getGeolocationAdapter().getCurrentPosition();
    setCapturing(false);
    if (result.ok) {
      updateDraft({ location: result.location, locationPermissionDenied: false });
      setLocationDenied(false);
    } else if (result.error === 'permission_denied') {
      setLocationDenied(true);
      updateDraft({ location: DEFAULT_PIN, locationPermissionDenied: true });
    } else {
      updateDraft({ location: DEFAULT_PIN });
    }
  };

  useEffect(() => {
    if (!location || !category) return;
    const payload = duplicateTrustFromDraft({
      title,
      description,
      category,
      severity,
      location,
      mediaAttachments,
      mediaIds: [],
      step: 2,
      aiStatus: 'idle',
      textOnlyFallback,
    });
    void analyzeDuplicateTrust(payload)
      .then((result) => {
        const updates = duplicateTrustToDraftUpdates(result);
        setDuplicateWarning(updates.duplicateWarning);
      })
      .catch(() => setDuplicateWarning(undefined));
  }, [
    location,
    category,
    description,
    title,
    mediaAttachments,
    textOnlyFallback,
    severity,
    setDuplicateWarning,
  ]);

  const adjustPin = (field: 'lat' | 'lng', value: string) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return;
    updateDraft({
      location: {
        ...pin,
        [field]: num,
      },
    });
  };

  const canContinue = location != null;

  return (
    <div className="space-y-4" data-testid="report-location-step">
      <MapPreviewCard
        label="Report location"
        pinCount={1}
        wardName={`${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`}
        highlighted
      />

      <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
        <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-civic-blue-600" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">Pin on map</p>
          <p className="text-xs text-muted-foreground">
            {capturing ? 'Getting your location…' : 'Fine-tune the pin if needed.'}
          </p>
          <p className="mt-2 font-mono text-xs" data-testid="location-pin-display">
            {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
          </p>
        </div>
      </div>

      {locationDenied ? (
        <div
          className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-3 text-sm"
          data-testid="permission-denied-location"
          role="alert"
        >
          <p className="font-medium text-amber-900">Location access denied</p>
          <p className="mt-1 text-xs text-amber-900/80">
            Adjust the pin manually below — reporting still works.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3" data-testid="location-pin-adjust">
        <div>
          <label className="text-xs font-medium" htmlFor="pin-lat">
            Latitude
          </label>
          <input
            id="pin-lat"
            type="number"
            step="0.00001"
            value={pin.lat}
            onChange={(e) => adjustPin('lat', e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border px-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="pin-lng">
            Longitude
          </label>
          <input
            id="pin-lng"
            type="number"
            step="0.00001"
            value={pin.lng}
            onChange={(e) => adjustPin('lng', e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border px-2 text-sm"
          />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={captureLocation} disabled={capturing}>
        {capturing ? 'Capturing…' : 'Use current location'}
      </Button>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button variant="civic" className="flex-1" disabled={!canContinue} onClick={() => setStep(3)}>
          Continue
        </Button>
      </div>
    </div>
  );
}

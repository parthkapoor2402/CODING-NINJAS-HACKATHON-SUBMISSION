import { useEffect } from 'react';
import { ReportShell } from '@/components/layout/PageShell';
import { EvidenceStep } from '@/features/reporting/steps/EvidenceStep';
import { DetailsStep } from '@/features/reporting/steps/DetailsStep';
import { LocationStep } from '@/features/reporting/steps/LocationStep';
import { ReviewStep } from '@/features/reporting/steps/ReviewStep';
import { SuccessStep } from '@/features/reporting/steps/SuccessStep';
import { REPORT_STEPS } from '@/types/reporting';
import { useReportDraftStore } from '@/store/reportDraftStore';

export default function ReportingPage() {
  const step = useReportDraftStore((s) => s.draft.step);
  const submittedReportId = useReportDraftStore((s) => s.draft.submittedReportId);
  const hydrate = useReportDraftStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (submittedReportId) {
    return (
      <div data-testid="report-flow">
        <SuccessStep />
      </div>
    );
  }

  return (
    <div data-testid="report-flow">
      <ReportShell step={step} totalSteps={REPORT_STEPS.length} title={REPORT_STEPS[step] ?? 'Report'}>
        {step === 0 ? <EvidenceStep /> : null}
        {step === 1 ? <DetailsStep /> : null}
        {step === 2 ? <LocationStep /> : null}
        {step === 3 ? <ReviewStep /> : null}
      </ReportShell>
    </div>
  );
}

import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HomeHero } from '@/features/home/HomeHero';
import ReportingPage from '@/features/reporting/ReportingPage';
import { ROUTES } from '@/lib/constants';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import { useReportDraftStore } from '@/store/reportDraftStore';

describe('ReportFlowLaunch', () => {
  beforeEach(() => {
    clearReportDraft();
    useReportDraftStore.getState().resetDraft();
  });

  it('C27: home primary CTA opens report flow', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<HomeHero persona="resident" />} />
          <Route path={ROUTES.report} element={<ReportingPage />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('home-primary-cta'));
    expect(screen.getByTestId('report-flow')).toBeInTheDocument();
    expect(screen.getByTestId('report-evidence-step')).toBeInTheDocument();
  });
});

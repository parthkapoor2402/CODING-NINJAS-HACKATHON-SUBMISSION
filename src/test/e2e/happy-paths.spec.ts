import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { completeOnboardingToAuth, resetE2EState, signInAdmin, signInCitizen, signInParent, signInYouth } from './helpers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoPhoto = path.join(__dirname, '../fixtures/demo-photo.jpg');

test.describe('E2E happy paths', () => {
  test.beforeEach(async ({ page }) => {
    await resetE2EState(page);
  });

  test('E01: onboarding to home via sign-in', async ({ page }) => {
    await completeOnboardingToAuth(page);
    await page.getByTestId('sign-in-continue').click();
    await page.getByRole('button', { name: /Continue as citizen/i }).click();
    await expect(page.getByTestId('home-hero')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Around you/i)).toBeVisible();
  });

  test('E02: first report with image upload', async ({ page }) => {
    await signInCitizen(page);
    await page.getByTestId('home-primary-cta').click();
    await expect(page.getByTestId('report-evidence-step')).toBeVisible();
    await page.getByTestId('report-gallery-image-input').setInputFiles(demoPhoto);
    await expect(page.getByTestId('media-preview')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: /^Continue$/i }).click();
    await expect(page.getByTestId('report-details-step')).toBeVisible();
  });

  test('E03: camera fallback visible when capture unavailable', async ({ page }) => {
    await signInCitizen(page);
    await page.goto('/app/report');
    await expect(page.getByTestId('report-evidence-step')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('report-evidence-sheet')).toBeVisible({ timeout: 10_000 });
    await page.getByTestId('text-only-fallback').click();
    await expect(page.getByTestId('text-only-evidence-notice')).toBeVisible();
  });

  test('E04: support existing report from nearby', async ({ page }) => {
    await signInCitizen(page);
    await page.goto('/app/nearby');
    await expect(page.getByTestId('nearby-feed')).toBeVisible({ timeout: 10_000 });
    const support = page.getByTestId('support-existing-btn').first();
    if (await support.isVisible()) {
      await support.click();
      await expect(support).toBeDisabled({ timeout: 10_000 });
    }
  });

  test('E05: community verification', async ({ page }) => {
    await signInParent(page);
    await page.goto('/app/community');
    const verify = page.getByTestId('verify-issue-btn').first();
    await expect(verify).toBeVisible({ timeout: 15_000 });
    await verify.click();
    await expect(page.getByText(/Confirmation recorded/i)).toBeVisible();
  });

  test('E06: rewards page shows catalog', async ({ page }) => {
    await signInCitizen(page);
    await page.goto('/app/rewards');
    await expect(page.getByTestId('reward-catalog')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('verified-points-total')).toBeVisible();
  });

  test('E07: youth family mode restrictions', async ({ page }) => {
    await signInYouth(page);
    await page.goto('/app/family');
    await expect(page.getByTestId('youth-rewards-restricted')).toBeVisible({ timeout: 15_000 });
  });

  test('E08: admin queue and moderation', async ({ page }) => {
    await signInAdmin(page);
    await page.goto('/admin/queue');
    await expect(page.getByTestId('admin-issue-queue')).toBeVisible();
    await page.goto('/admin/moderation');
    await expect(page.getByTestId('suspicious-reports-queue')).toBeVisible();
    await expect(page.getByTestId('abuse-review-queue')).toBeVisible();
  });

  test('E09: admin analytics dashboard', async ({ page }) => {
    await signInAdmin(page);
    await page.goto('/admin/analytics');
    await expect(page.getByTestId('response-time-metrics')).toBeVisible();
    await expect(page.getByTestId('predictive-insights-cards')).toBeVisible();
  });

  test('E10: suspicious issue detail notice', async ({ page }) => {
    await signInCitizen(page);
    await page.goto('/app/issue/report-003');
    await expect(page.getByTestId('suspicious-issue-notice')).toBeVisible({ timeout: 10_000 });
  });
});

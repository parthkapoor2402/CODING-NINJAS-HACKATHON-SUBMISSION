import { expect, type Page } from '@playwright/test';

export async function resetE2EState(page: Page): Promise<void> {
  await page.goto('/splash');
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
}

export async function signInCitizen(page: Page): Promise<void> {
  await page.goto('/auth');
  await page.getByRole('button', { name: /Continue as citizen/i }).click();
  await expect(page.getByTestId('home-hero')).toBeVisible({ timeout: 15_000 });
}

export async function signInAdmin(page: Page): Promise<void> {
  await page.goto('/auth');
  await page.getByRole('button', { name: /Admin demo/i }).click();
  await expect(page.getByTestId('admin-dashboard-kpis')).toBeVisible({ timeout: 15_000 });
}

export async function signInParent(page: Page): Promise<void> {
  await page.goto('/auth');
  await page.getByRole('button', { name: /Parent demo/i }).click();
  await expect(page.getByTestId('home-hero')).toBeVisible({ timeout: 15_000 });
}

export async function signInYouth(page: Page): Promise<void> {
  await page.goto('/auth');
  await page.getByRole('button', { name: /Youth demo/i }).click();
  await expect(page.getByTestId('home-hero')).toBeVisible({ timeout: 15_000 });
}

export async function completeOnboardingToAuth(page: Page): Promise<void> {
  await page.goto('/onboarding');
  await page.getByTestId('persona-commuter').click();
  await page.getByTestId('onboarding-continue').click();
  await page.getByText(/location makes sense/i).click();
  await page.getByTestId('onboarding-continue').click();
  await page.getByText(/camera makes sense/i).click();
  await page.getByTestId('onboarding-continue').click();
  await page.getByText(/notifications make sense/i).click();
  await page.getByTestId('onboarding-continue').click();
  await expect(page.getByTestId('sign-in-continue')).toBeVisible();
}

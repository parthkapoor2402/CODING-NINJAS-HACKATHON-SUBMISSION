import { test, expect } from '@playwright/test';
import { resetE2EState } from './helpers';

test.beforeEach(async ({ page }) => {
  await resetE2EState(page);
});

test('auth page loads', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.getByTestId('auth-page')).toBeVisible();
  await expect(page.getByTestId('sign-in-options')).toBeVisible();
});
test('citizen demo sign-in navigates to home', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: /Continue as citizen/i }).click();
  await expect(page.getByText('Around you')).toBeVisible({ timeout: 10000 });
});

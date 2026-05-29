import { test, expect } from '@playwright/test';
import {
  fillJobSearch,
  uploadResume,
  waitForProcessingAndResults,
  fillStripeTestCard,
} from './helpers';

/**
 * $1 a-la-carte download — no sign-in required.
 *
 * Flow:
 *  Home → Upload → Processing → Results
 *  → Click "$1 Download this resume"
 *  → Stripe hosted checkout (test card 4242...)
 *  → Redirected back to /results?payment=success
 *  → "Download in Word (.docx)" button appears
 */
test.describe('$1 a-la-carte resume download', () => {
  test('should pay $1 and unlock download without signing in', async ({ page }) => {
    // ── Step 1–3: run the optimisation flow ──────────────────────────────
    await fillJobSearch(page);
    await uploadResume(page);
    await waitForProcessingAndResults(page);

    // ── Step 4: Verify we're on results and NOT already signed in ────────
    await expect(page).toHaveURL(/\/results/);

    // The a-la-carte CTA should be visible without auth
    const alacartBtn = page.getByRole('button', { name: /download this resume.*\$1|\$1.*download/i });
    await expect(alacartBtn).toBeVisible({ timeout: 15_000 });

    // ── Step 5: Kick off Stripe checkout ────────────────────────────────
    await alacartBtn.click();

    // ── Step 6: Fill Stripe test card on hosted checkout page ────────────
    await fillStripeTestCard(page);

    // ── Step 7: Stripe redirects back to /results?payment=success ────────
    await page.waitForURL(/payment=success/, { timeout: 60_000 });
    await page.waitForLoadState('networkidle');

    // ── Step 8: Download button should now be unlocked ───────────────────
    const docxBtn = page.getByRole('button', { name: /download in word/i });
    await expect(docxBtn).toBeVisible({ timeout: 20_000 });

    // Confirm the button is clickable and triggers a download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      docxBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.docx$/i);
  });
});

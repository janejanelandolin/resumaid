import { test, expect } from '@playwright/test';
import {
  fillJobSearch,
  uploadResume,
  waitForAnalysis,
  proceedToResults,
  signUp,
  fillStripeTestCard,
  uniqueEmail,
} from './helpers';

test.describe('New user signup + Stripe payment', () => {
  test('should sign up, pay, and access download', async ({ page }) => {
    const email = uniqueEmail();
    const password = 'TestPass123!';

    // Step 1–3: Run through the resume optimization flow
    await fillJobSearch(page);
    await uploadResume(page);
    await waitForAnalysis(page);
    await proceedToResults(page);

    // Step 4: Click "Sign in to Download" → sign up as new user
    await signUp(page, email, password);

    // After signup Supabase auto-confirms the email (test mode must be enabled)
    // The modal should close and user is now signed in

    // Step 5: Trigger the subscription checkout
    // After sign-in a subscribed user sees "Download in Word" but a new user
    // without subscription sees "Subscribe for $14.99/month"
    const subscribeBtn = page.getByRole('button', { name: /subscribe/i });
    await expect(subscribeBtn).toBeVisible({ timeout: 15_000 });
    await subscribeBtn.click();

    // Step 6: Fill in Stripe test card on hosted checkout page
    await fillStripeTestCard(page);

    // Step 7: Stripe redirects back to the app after successful payment
    await page.waitForURL(/resumaid\.app/, { timeout: 60_000 });
    await page.waitForLoadState('networkidle');

    // The download button should now be accessible
    const docxBtn = page.getByRole('button', { name: /download in word/i });
    await expect(docxBtn).toBeVisible({ timeout: 20_000 });
  });
});

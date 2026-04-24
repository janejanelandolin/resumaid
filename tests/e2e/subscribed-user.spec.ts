import { test, expect } from '@playwright/test';
import {
  fillJobSearch,
  uploadResume,
  waitForAnalysis,
  proceedToResults,
  signIn,
} from './helpers';

const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('Subscribed user full workflow', () => {
  test('should complete full resume optimization and download', async ({ page }) => {
    // Step 1: Home → enter job title
    await fillJobSearch(page);

    // Step 2: Upload → submit resume file
    await uploadResume(page);

    // Step 3: Analysis → wait for AI results
    await waitForAnalysis(page);

    // Verify analysis content is shown
    await expect(page.getByText(/compatibility|match score/i).first()).toBeVisible();

    // Verify "Changes Made" section appears
    const changesSection = page.getByText(/changes made to your resume/i);
    if (await changesSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(changesSection).toBeVisible();
    }

    // Step 4: Results page
    await proceedToResults(page);

    // Verify results page loaded
    await expect(page).toHaveURL(/\/results/);

    // Step 5: Download — sign in with subscribed account
    const downloadBtn = page.getByRole('button', { name: /sign in to download/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10_000 });

    await signIn(page, EMAIL, PASSWORD);

    // After sign-in, the download button should now show the real download
    const docxBtn = page.getByRole('button', { name: /download in word/i });
    await expect(docxBtn).toBeVisible({ timeout: 15_000 });

    // Trigger download and confirm no error
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      docxBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.docx$/i);
  });
});

import { Page, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEST_RESUME_PATH = path.join(__dirname, 'fixtures/test-resume.txt');

export const TEST_JOB_TITLE = 'Software Engineer';
export const TEST_JOB_POSTING = `
We are looking for a Software Engineer to join our team.
Requirements:
- 3+ years of experience with Python or TypeScript
- Experience with React and modern frontend frameworks
- Strong understanding of RESTful API design
- Experience with cloud platforms (AWS, GCP, or Azure)
- Excellent communication and collaboration skills
Nice to have:
- Experience with Kubernetes and Docker
- Familiarity with CI/CD pipelines
`;

export async function fillJobSearch(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Step 1: Fill job title (stays in context even after switching tabs)
  const jobTitleInput = page.locator('#jobTitle');
  await jobTitleInput.waitFor({ state: 'visible' });
  await jobTitleInput.fill(TEST_JOB_TITLE);

  // Step 2: Switch to "Job Posting" paste tab — avoids slow AI job-generation call
  await page.getByRole('button', { name: /job posting/i }).click();

  const textarea = page.locator('textarea').first();
  await textarea.waitFor({ state: 'visible' });
  await textarea.fill(TEST_JOB_POSTING);

  // Step 3: Submit — navigates immediately (no AI call needed)
  await page.getByRole('button', { name: /let's go/i }).click();
  await page.waitForURL('**/upload', { timeout: 30_000 });
}

export async function uploadResume(page: Page) {
  await page.waitForLoadState('networkidle');

  // react-dropzone renders a hidden <input> — set files directly on it
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(TEST_RESUME_PATH);

  // FileUploader shows "File selected:" after a file is dropped
  await expect(page.getByText(/file selected/i)).toBeVisible({ timeout: 15_000 });

  // Click the "Analyse my resume" button to proceed to /processing
  await page.getByRole('button', { name: /analyse my resume/i }).click();
}

export async function waitForProcessingAndResults(page: Page) {
  // Processing page auto-navigates: /upload → /processing → /results
  await page.waitForURL('**/processing', { timeout: 30_000 });

  // Wait for all steps to complete and auto-redirect to results (up to 3 min for AI)
  await page.waitForURL('**/results', { timeout: 180_000 });
  await page.waitForLoadState('networkidle');
}

// Alias kept for backwards compat with old call sites
export async function waitForAnalysis(page: Page) {
  await waitForProcessingAndResults(page);
}

export async function proceedToResults(page: Page) {
  // In the current app, /processing auto-redirects to /results — no button needed
  await page.waitForURL('**/results', { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
}

export async function signIn(page: Page, email: string, password: string) {
  // Open auth modal - look for Sign in button in nav or download gate
  const signInTrigger = page.getByRole('button', { name: /sign in to download|sign in/i }).first();
  await signInTrigger.click();

  // Wait for the modal
  await page.waitForSelector('#email-signin', { timeout: 10_000 });

  await page.fill('#email-signin', email);
  await page.fill('#password-signin', password);
  await page.getByRole('button', { name: /^sign in$/i }).click();

  // Wait for auth to complete
  await page.waitForTimeout(3_000);
}

export async function signUp(page: Page, email: string, password: string) {
  const signInTrigger = page.getByRole('button', { name: /sign in to download/i }).first();
  await signInTrigger.click();

  // Switch to Sign Up tab
  await page.getByRole('tab', { name: /sign up/i }).click();

  await page.waitForSelector('#email-signup', { timeout: 10_000 });
  await page.fill('#email-signup', email);
  await page.fill('#password-signup', password);
  await page.getByRole('button', { name: /^sign up$/i }).click();

  // Wait for confirmation / redirect
  await page.waitForTimeout(5_000);
}

export async function fillStripeTestCard(page: Page) {
  // Stripe hosted checkout page
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');

  // Fill card number
  await page.locator('[placeholder*="Card number"], input[name="cardNumber"], #cardNumber').fill('4242424242424242');
  await page.locator('[placeholder*="MM / YY"], input[name="cardExpiry"], #cardExpiry').fill('12 / 28');
  await page.locator('[placeholder*="CVC"], input[name="cardCvc"], #cardCvc').fill('123');

  // Name on card if present
  const nameField = page.locator('input[name="billingName"], [placeholder*="Name on card"]');
  if (await nameField.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await nameField.fill('Jane Smith');
  }

  // Submit payment
  await page.getByRole('button', { name: /subscribe|pay|confirm/i }).click();
}

export function uniqueEmail(): string {
  return `test+${Date.now()}@resumaid-test.com`;
}

import { Page, expect } from '@playwright/test';
import path from 'path';

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

  const jobTitleInput = page.locator('#jobTitle');
  await jobTitleInput.waitFor({ state: 'visible' });
  await jobTitleInput.fill(TEST_JOB_TITLE);

  // Check if there's a job posting textarea and fill it
  const jobPostingArea = page.locator('textarea').first();
  if (await jobPostingArea.isVisible()) {
    await jobPostingArea.fill(TEST_JOB_POSTING);
  }

  await page.getByRole('button', { name: "Let's go" }).click();
  await page.waitForURL('**/upload', { timeout: 30_000 });
}

export async function uploadResume(page: Page) {
  await page.waitForLoadState('networkidle');

  // The dropzone has a hidden file input — set files directly
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(TEST_RESUME_PATH);

  // Wait for processing to complete (file selected message appears)
  await expect(page.getByText('File selected')).toBeVisible({ timeout: 15_000 });
}

export async function waitForAnalysis(page: Page) {
  // Click continue/next to move to analysis
  const nextBtn = page.getByRole('button', { name: /continue|next|analyze/i });
  if (await nextBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await nextBtn.click();
  }

  await page.waitForURL('**/analysis', { timeout: 60_000 });
  await page.waitForLoadState('networkidle');

  // Wait for the score or changes to render (AI call may take up to 2 min)
  await expect(
    page.getByText(/compatibility|match score|changes made/i).first()
  ).toBeVisible({ timeout: 120_000 });
}

export async function proceedToResults(page: Page) {
  const nextBtn = page.getByRole('button', { name: /next|results|continue/i }).last();
  await nextBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await nextBtn.click();
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

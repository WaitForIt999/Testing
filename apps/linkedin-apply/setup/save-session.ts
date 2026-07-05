import { page,  from 'playwright';

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
//  CONFIGURATION — edit this section
// ─────────────────────────────────────────────
const CONFIG = {
  // Job search query
  keywords: 'QA Automation Engineer',

  // Location (city, country, or "Remote")
  location: 'Prague',

  // Maximum number of jobs to apply to per run
  maxApplications: 10,

  // Skip jobs whose titles contain these words (case-insensitive)
  titleBlocklist: ['senior principal', 'director', 'manager', 'intern'],

  // Skip jobs at these companies (case-insensitive, partial match)
  companyBlocklist: [],

  // If a multi-page Easy Apply form has more than this many steps, skip it
  maxFormSteps: 4,

  // Pause between actions (ms) — keeps behaviour human-like
  delayBetweenActions: 1200,

  // Headless: set true to run in background (less detectable if false)
  headless: false,
};
// ─────────────────────────────────────────────

const SESSION_PATH = path.join(__dirname, 'session.json');
const RESULTS_PATH = path.join(__dirname, 'results.json');

// ── Helpers ──────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 400));
}

function log(emoji, msg) {
  const ts = new Date().toLocaleTimeString();
  console.log(`[${ts}] ${emoji}  ${msg}`);
}

function saveResult(entry) {
  let results = [];
  if (fs.existsSync(RESULTS_PATH)) {
    try { results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8')); } catch {}
  }
  results.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
}

function shouldSkipTitle(title) {
  return CONFIG.titleBlocklist.some((word) =>
    title.toLowerCase().includes(word.toLowerCase())
  );
}

function shouldSkipCompany(company) {
  return CONFIG.companyBlocklist.some((word) =>
    company.toLowerCase().includes(word.toLowerCase())
  );
}

// ── Easy Apply handler ───────────────────────

/**
 * Attempts to complete an Easy Apply modal.
 * Returns 'applied' | 'skipped' | 'error'.
 */
async function handleEasyApply(page) {
  let step = 0;

  while (true) {
    step++;

    if (step > CONFIG.maxFormSteps) {
      log('⏭', `Form has more than ${CONFIG.maxFormSteps} steps — skipping`);
      // Close the modal
      const closeBtn = page.locator('button[aria-label="Dismiss"]').first();
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click();
        await sleep(600);
        // Confirm discard if prompted
        const discardBtn = page.locator('button[data-control-name="discard_application_confirm_btn"]');
        if (await discardBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await discardBtn.click();
        }
      }
      return 'skipped';
    }

    // Wait for the modal to be ready
    await page.waitForSelector('.jobs-easy-apply-modal', { timeout: 8000 });

    // Check for a "Submit application" button — we're on the last step
    const submitBtn = page.locator('button[aria-label="Submit application"]');
    if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await sleep(CONFIG.delayBetweenActions);
      await submitBtn.click();
      await sleep(1500);
      return 'applied';
    }

    // Fill any visible phone number fields that are empty
    const phoneInputs = page.locator('input[id*="phoneNumber"]');
    const phoneCount = await phoneInputs.count();
    for (let i = 0; i < phoneCount; i++) {
      const input = phoneInputs.nth(i);
      const val = await input.inputValue();
      if (!val) {
        await input.fill('+420 727 884 933'); // replace with your real number
      }
    }

    // Answer any radio-button questions (pick first option by default)
    const radioGroups = page.locator('fieldset.fb-radio-button-group');
    const radioCount = await radioGroups.count();
    for (let i = 0; i < radioCount; i++) {
      const firstRadio = radioGroups.nth(i).locator('input[type="radio"]').first();
      const isChecked = await firstRadio.isChecked().catch(() => false);
      if (!isChecked) {
        await firstRadio.check().catch(() => {});
      }
    }

    // Fill numeric inputs that are empty with "0" (years of experience etc.)
    const numberInputs = page.locator('input[type="text"][id*="numeric"]');
    const numCount = await numberInputs.count();
    for (let i = 0; i < numCount; i++) {
      const input = numberInputs.nth(i);
      const val = await input.inputValue();
      if (!val) await input.fill('5'); // adjust as needed
    }

    // Click "Next" or "Review" to advance
    const nextBtn = page.locator(
      'button[aria-label="Continue to next step"], button[aria-label="Review your application"]'
    );
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sleep(CONFIG.delayBetweenActions);
      await nextBtn.click();
    } else {
      // Can't advance — bail out
      log('⚠', 'Could not find Next/Review button — skipping this job');
      const closeBtn = page.locator('button[aria-label="Dismiss"]').first();
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click();
        await sleep(600);
        const discardBtn = page.locator('button[data-control-name="discard_application_confirm_btn"]');
        if (await discardBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await discardBtn.click();
        }
      }
      return 'skipped';
    }

    await sleep(CONFIG.delayBetweenActions);
  }
}

// ── Main ─────────────────────────────────────

(async () => {
  if (!fs.existsSync(SESSION_PATH)) {
    console.error('❌  session.json not found. Run save-session.ts first.');
    process.exit(1);
  }

  log('🚀', 'Launching browser with saved session...');
  const browser = await chromium.launch({ headless: CONFIG.headless });
  const context = await browser.newContext({
    storageState: SESSION_PATH,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // ── Navigate to job search ──
  const searchUrl =
    `https://www.linkedin.com/jobs/search-results/?currentJobId=4426803853&keywords=Quality&origin=JOB_SEARCH_PAGEhttps://www.linkedin.com/jobs/search-results/?currentJobId=4432413177&keywords=Quality&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&referralSearchId=OstNDv7PeBWI%2B2iP5Mu5nQ%3D%3D&geoId=91000000&f_TPR=r86400&f_AL=true&f_EA=true_JOB_FILTER&referralSearchId=OstNDv7PeBWI%2B2iP5Mu5nQ%3D%3D&f_TPR=r86400&f_AL=true&f_EA=true` 

  log('🔍', `Searching: "${CONFIG.keywords}" in "${CONFIG.location}"`);
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  await sleep(2000);

  // Verify we're logged in
  const loginBtn = page.locator('a[href*="/login"]');
  if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    log('❌', 'Session expired. Run save-session.ts again to refresh it.');
    await browser.close();
    process.exit(1);
  }

  let applied = 0;
  let skipped = 0;
  let pageNum = 1;

  while (applied < CONFIG.maxApplications) {
    log('📄', `Processing results page ${pageNum}...`);

    // Wait for job cards to load
    await page.waitForSelector('.jobs-search-results__list-item', { timeout: 10000 })
      .catch(() => {});

    const jobCards = await page.locator('.jobs-search-results__list-item').all();

    if (jobCards.length === 0) {
      log('🏁', 'No more job listings found.');
      break;
    }

    for (const card of jobCards) {
      if (applied >= CONFIG.maxApplications) break;

      // Extract job title and company from the card
      const titleEl = card.locator('.job-card-list__title, .job-card-container__link');
      const companyEl = card.locator('.job-card-container__primary-description, .job-card-container__company-name');

      const title = (await titleEl.innerText().catch(() => '')).trim();
      const company = (await companyEl.innerText().catch(() => '')).trim();

      if (!title) continue;

      if (shouldSkipTitle(title)) {
        log('⏩', `Skipping (title blocklist): ${title}`);
        saveResult({ title, company, status: 'skipped', reason: 'title blocklist' });
        skipped++;
        continue;
      }

      if (shouldSkipCompany(company)) {
        log('⏩', `Skipping (company blocklist): ${company}`);
        saveResult({ title, company, status: 'skipped', reason: 'company blocklist' });
        skipped++;
        continue;
      }

      log('👆', `Clicking: ${title} @ ${company}`);
      await card.click();
      await sleep(CONFIG.delayBetweenActions);

      // Wait for the job detail panel to load
      await page.waitForSelector('.jobs-unified-top-card', { timeout: 8000 }).catch(() => {});

      // Look for Easy Apply button
      const easyApplyBtn = page.locator(
        'button.jobs-apply-button:has-text("Easy Apply"), button[aria-label*="Easy Apply"]'
      ).first();

      const canEasyApply = await easyApplyBtn.isVisible({ timeout: 3000 }).catch(() => false);

      if (!canEasyApply) {
        log('⏩', `No Easy Apply button — skipping`);
        saveResult({ title, company, status: 'skipped', reason: 'no Easy Apply button' });
        skipped++;
        continue;
      }

      await easyApplyBtn.click();
      await sleep(1000);

      let result;
      try {
        result = await handleEasyApply(page);
      } catch (error) {
        log('💥', `Error during Easy Apply: ${error.message}`);
        result = 'error';
        // Try to close any open modal
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(800);
      }

      if (result === 'applied') {
        applied++;
        log('✅', `Applied! (${applied}/${CONFIG.maxApplications}) — ${title} @ ${company}`);
        saveResult({ title, company, status: 'applied' });
      } else {
        skipped++;
        log('⏭', `Skipped — ${title} @ ${company}`);
        saveResult({ title, company, status: result });
      }

      await sleep(CONFIG.delayBetweenActions * 1.5);
    }

    // ── Go to next page ──
    const nextPage = page.locator('button[aria-label="View next page"]');
    const hasNext = await nextPage.isVisible({ timeout: 3000 }).catch(() => false);
    if (!hasNext) {
      log('🏁', 'No more pages.');
      break;
    }

    await nextPage.click();
    pageNum++;
    await sleep(2500);
  }

  log('🎉', `Done! Applied: ${applied}, Skipped: ${skipped}`);
  log('📁', `Results saved to results.json`);

  await browser.close();
})();
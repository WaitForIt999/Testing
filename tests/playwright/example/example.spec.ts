import { test, expect, Page } from '@playwright/test';

test('should have the correct title', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
});
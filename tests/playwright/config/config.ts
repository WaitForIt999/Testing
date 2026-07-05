import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/playwright/example',
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        browserName: 'chromium',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        navigationTimeout: 30 * 1000,
        locale: 'en-US',
        httpCredentials: {
            username: 'your-username',
            password: 'your-password'
        }
    }
});
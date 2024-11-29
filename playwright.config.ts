import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

// Load .env variables
dotenv.config()

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	globalSetup: './global-setup.ts',
	testDir: './scripts',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},
	// Glob patterns or regular expressions that match test files.
	testMatch: '*scripts/*.script.ts',

	/* Configure projects for major browsers */
	projects: [
		// Setup project
		// { name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'commentBot',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: './.auth/user.json',
			},
			// dependencies: ['setup'],
		},
	],
})
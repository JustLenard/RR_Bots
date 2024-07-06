import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
	await page.goto('https://www.royalroad.com/account/login?returnurl=%2Fhome')
	await page.locator('#email').click()
	await page.locator('#email').fill('')
	await page.locator('#email').press('Tab')
	await page.getByLabel('Password:').fill('')
	await page.getByText('Remember me').click()
	await page.getByRole('button', { name: 'Sign In' }).click()

	await page.waitForURL('https://www.royalroad.com/home')
	// await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible()

	// End of authentication steps.

	await page.context().storageState({ path: authFile })
})

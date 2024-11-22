import { test as setup } from '@playwright/test'
import { MAIN_URL } from '../utils/constants'

const authFile = './.auth/user.json'

setup('authenticate', async ({ page }) => {
	const email = process.env.RR_EMAIL!
	const password = process.env.RR_PASSWORD!

	await page.goto(`${MAIN_URL}/account/login?returnurl=%2Fhome`)
	await page.locator('#email').click()
	await page.locator('#email').fill(email)
	await page.locator('#email').press('Tab')
	await page.getByLabel('Password:').fill(password)
	await page.getByText('Remember me').click()
	await page.getByRole('button', { name: 'Sign In' }).click()
	await page.waitForURL(`${MAIN_URL}/home`)
	// await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible()
	// End of authentication steps.
	await page.context().storageState({ path: authFile })
})

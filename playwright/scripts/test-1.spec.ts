import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
	await page.goto(
		'https://www.royalroad.com/fiction/81642/cultivation-nerd-xianxia/chapter/1741092/chapter-142-coin-sides'
	)
	await page.getByRole('button', { name: 'Accept' }).click()
	await page.getByRole('link', { name: ' Log In' }).first().click()
	await page.locator('#email').click()
	await page.locator('#email').fill('justlenard.justme@gmail.com')
	await page.locator('#email').press('Tab')
	await page.getByLabel('Password:').fill('Close23282001')
	await page.getByLabel('Password:').press('Enter')
	// locator('#comment-container-12815802')
	// getByRole('link', { name: 'Next ›' }await page.frameLocator('#comment_ifr').getByRole('paragraph').click();
	await page.frameLocator('#comment_ifr').locator('html').click()
	await page.frameLocator('#comment_ifr').getByRole('paragraph').click()
	await page.frameLocator('#comment_ifr').getByRole('paragraph').click()
	//  await page.frameLocator('#comment_ifr').getByLabel('Rich Text Area. Press ALT-0').fill('mate'))

	//  getByRole('button', { name: 'Post' }).first()
})

import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
	await page.goto('https://www.royalroad.com/fiction/65629/the-game-at-carousel-a-horror-movie-litrpg')
	await page.getByRole('button', { name: 'Accept' }).click()
	const res = await page.locator('.chapter-row').first().getByRole('link').first().getAttribute('href')

	console.log('This is res', res)
})

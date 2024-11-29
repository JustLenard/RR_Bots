import { Page } from 'playwright'
import { MY_COMMENT } from '../utils/constants'

export const leaveComment = async (page: Page): Promise<boolean> => {
	const iframe = page.frameLocator('iframe[id="comment_ifr"]')
	iframe.locator('#tinymce').first().fill(MY_COMMENT)
	await page.getByRole('button', { name: 'Post' }).first().click()
	return true
}

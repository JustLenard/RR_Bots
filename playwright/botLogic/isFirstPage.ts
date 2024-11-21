import { Page } from 'playwright'

export const isFirstPage = async (page: Page): Promise<boolean> => {
	const navButtons = page.locator('.nav-buttons')
	const prev = await navButtons.getByText('Previous Chapter').getAttribute('href')

	// console.log('This is disabledPreviousChapterButton', await disabledPreviousChapterButton.count())
	return prev ? true : false
}

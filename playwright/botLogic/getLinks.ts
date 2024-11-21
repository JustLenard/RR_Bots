import { Page } from '@playwright/test'
import { MAIN_URL } from '../utils/constants'
import { IFictionInfo } from '../utils/types'

// export const getNextToCommentOnChapterLink = async (page: Page, fic: IFictionInfo): Promise<string> => {
// 	if (!fic.lastCommentedOnChapter) {
// 		return getFirstChapterOfTheFiction(page, fic)
// 	} else {
// 		return getNextChapter(page, fic.lastCommentedOnChapter.fullPath)
// 	}
// }

export const getPreviousChapterOfCurrentFic = async (page: Page): Promise<string> => {
	const prevChapter = `${await page.getByRole('link', { name: '/Previous Chapter/' }).first().getAttribute('href')}`
	return `${MAIN_URL}/${prevChapter}`
}

export const getFirstChapterOfTheFiction = async (page: Page, fic: IFictionInfo): Promise<string> => {
	await page.goto(`${MAIN_URL}/fiction/${fic.fictionId}/${fic.nameInUrl}`)
	const firstChapter = `${await page.locator('.chapter-row').first().getByRole('link').first().getAttribute('href')}`

	return `${MAIN_URL}/${firstChapter}`
}

// const getNextChapter = async (page: Page, lastCommentedOnChapter: string): Promise<string> => {
// 	await page.goto(lastCommentedOnChapter)
// 	const nextChapter = `${await page.getByRole('link', { name: '/Next Chapter/' }).first().getAttribute('href')}`

// 	return `${MAIN_URL}/${nextChapter}`
// }

/**
 * Get the link to the previous chapter of the current fiction.
 * Returns null if it's the first chapter of the fiction
 **/
export const getPrevChapter = async (page: Page): Promise<string | null> => {
	const navButtons = page.locator('.nav-buttons')
	const shortenedLink = await navButtons.getByText('Previous Chapter').getAttribute('href')
	return shortenedLink ? `${MAIN_URL}${shortenedLink}` : null
}

/**
 * Get the link to the next chapter of the current fiction.
 * Returns null if it's the last chapter of the fiction
 **/
export const getNextChapter = async (page: Page): Promise<string | null> => {
	const navButtons = page.locator('.nav-buttons')
	const shortenedLink = await navButtons.getByText('Next Chapter').getAttribute('href')
	return shortenedLink ? `${MAIN_URL}${shortenedLink}` : null
}

import { Page } from '@playwright/test'
import { MAIN_URL } from '../utils/constants'
import { IFictionInfo } from '../utils/types'

export const getNextToCommentOnChapterLink = async (page: Page, fic: IFictionInfo): Promise<string> => {
	if (!fic.lastCommentedOnChapter) {
		return getFirstChapterOfTheFiction(page, fic)
	} else {
		return getNextChapter(page, fic.lastCommentedOnChapter.fullPath)
	}
}

export const getPreviousChapterOfCurrentFic = async (page: Page): Promise<string> => {
	const nextChapter = `${await page.getByRole('link', { name: '/Previous Chapter/' }).first().getAttribute('href')}`

	return `${MAIN_URL}/${nextChapter}`
}

const getFirstChapterOfTheFiction = async (page: Page, fic: IFictionInfo): Promise<string> => {
	await page.goto(`${MAIN_URL}/fiction/${fic.fictionId}/${fic.nameInUrl}`)
	const firstChapter = `${await page.locator('.chapter-row').first().getByRole('link').first().getAttribute('href')}`

	return `${MAIN_URL}/${firstChapter}`
}

const getNextChapter = async (page: Page, lastCommentedOnChapter: string): Promise<string> => {
	await page.goto(lastCommentedOnChapter)
	const nextChapter = `${await page.getByRole('link', { name: '/Next Chapter/' }).first().getAttribute('href')}`

	return `${MAIN_URL}/${nextChapter}`
}

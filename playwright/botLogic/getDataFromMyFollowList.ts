import { Page } from '@playwright/test'
import { FOLLOW_PAGE } from '../utils/constants'
import { createChpaterData } from '../utils/helpers'
import { IFictionInfo } from '../utils/types'

export const getDataFromMyFollowList = async (page: Page): Promise<IFictionInfo[]> => {
	const fictionsInfo: IFictionInfo[] = []
	await page.goto(FOLLOW_PAGE)
	// await page.waitForSelector('button', { name: 'Accept' })
	await page.getByRole('button', { name: 'Accept' }).click()
	// await page.getByRole('button', { name: 'No' }).click()
	const res = await page.locator('.fiction-list-item.row')

	/**
	 * Get data for the fictions on my follow list
	 **/
	for (const fictionContainer of await page.locator('.fiction-list-item.row').all()) {
		const fictionInfo = {} as IFictionInfo
		const title = (await fictionContainer.locator('.fiction-title').textContent())?.trim()

		if (!title) throw Error(`Bad title ${title}`)
		fictionInfo.name = title
		const link = await fictionContainer.getByRole('link').first().getAttribute('href')

		if (!link) throw Error(`Bad link ${link}`)

		const splitLink = link.split('/')

		fictionInfo.nameInUrl = splitLink[3]
		fictionInfo.fictionId = Number(splitLink[2])

		const listItemContainer = fictionContainer.locator('.list-item')

		/**
		 * If there is a new chapter that I haven't read
		 **/
		if ((await listItemContainer.count()) === 2) {
			const length = await fictionContainer.locator('.list-item').count()
			const newestChapter = await fictionContainer
				.locator('.list-item')
				.first()
				.getByRole('link')
				.getAttribute('href')

			if (!newestChapter) throw Error(`Bad  ${newestChapter}`)

			fictionInfo.newestChapter = createChpaterData(newestChapter)
			const lastRead = await fictionContainer.locator('.list-item').last().getByRole('link').getAttribute('href')

			if (!lastRead) throw Error(`Bad title name ${lastRead}`)

			fictionInfo.lastReadChapter = createChpaterData(lastRead)
			/**
			 * I've already read the last chapter that came out
			 **/
		} else {
			const lastReadAndLastPublished = await fictionContainer
				.locator('.list-item')
				.last()
				.getByRole('link')
				.getAttribute('href')
			if (!lastReadAndLastPublished) throw Error(`Bad title name ${lastReadAndLastPublished}`)
			fictionInfo.lastReadChapter = createChpaterData(lastReadAndLastPublished)
			fictionInfo.newestChapter = createChpaterData(lastReadAndLastPublished)
		}
		fictionsInfo.push(fictionInfo)
	}
	return fictionsInfo
}

import { Page, test } from '@playwright/test'
import { getPreviousChapterOfCurrentFic } from '../botLogic/getLinks'
import { isFirstPage } from '../botLogic/isFirstPage'
import { needToLeaveComment } from '../botLogic/needToLeaveComment'
import { createChapterData } from '../utils/helpers'
import { IChapterInfo } from '../utils/types'

test('runCommentBot', async ({ page }) => {
	// fs.writeFileSync('data/fictions.json', JSON.stringify(fictionsInfo))

	// const needTocommentOnFictions = separateStuff(oldFic, fictionsInfo)

	// const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/581595/arc-1-chapter-5']
	// const fictionsInfo = await getFictionDataFromMyFollowList(page)

	// const fic = ['https://www.royalroad.com/fiction/26675/a-journey-of-black-and-red/chapter/396750/8-outside']
	const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/578251/arc-1-chapter-1']
	// const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/578706/arc-1-chapter-2']

	// if (!fs.existsSync('data/fictions.json')) {
	// 	fs.writeFileSync('data/fictions.json', '{}', 'utf-8')
	// }

	// const savedFictions: ISaveFormat = JSON.parse(fs.readFileSync('data/fictions.json', 'utf-8'))
	// const jsonToSave: ISaveFormat = {}
	// // for (const fic of fictionsInfo) {
	// // 	const savedOldFic = savedFictions[fic.fictionId]

	// // 	if (savedFictions && savedOldFic) {
	// // 		const lastReadChapter = fic.lastReadChapter.chapterId
	// // 		const lastCommentedOnChapter = savedOldFic.lastCommentedOnChapter?.chapterId

	// // 		if (lastReadChapter === lastCommentedOnChapter) {
	// // 			jsonToSave[fic.fictionId].lastCommentedOnChapter = savedOldFic.lastCommentedOnChapter
	// // 			continue
	// // 		}
	// // 	}

	// // 	const nextToCommentOnChapterLink = await getNextToCommentOnChapterLink(page, fic)

	/**
	 * @todo fix it.
	 **/
	// // 	const nextToCommentOnChapterLink = getFirstChapterOfTheFiction

	// // 	// const newLastCommentedOnChater = await handleCommentRecurrsionLogic(page, nextToCommentOnChapterLink)
	// // 	const newLastCommentedOnChater = await handleCommentRecurrsionLogic(page, nextToCommentOnChapterLink)

	// // 	jsonToSave[fic.fictionId].lastCommentedOnChapter = newLastCommentedOnChater
	// // }
	// fs.writeFileSync('data/fictions2.json', JSON.stringify(jsonToSave), 'utf-8')

	await handleCommentRecurrsionLogic(page, fic[0])

	page.waitForTimeout(6000)
})

const handleCommentRecurrsionLogic = async (
	page: Page,
	fictionLink: string,
	commentsWritten = 0,
	maxCommentPermitted = 5
): Promise<IChapterInfo> => {
	await page.goto(fictionLink)
	/**
	 * @todo remove this line later
	 **/
	await page.getByRole('button', { name: 'Accept' }).click()

	const udpatedData = createChapterData(page.url())

	/**
	 * Delete this true
	 **/
	// await page.getByRole('button', { name: 'Accept' }).click()

	if (commentsWritten >= maxCommentPermitted) {
		return udpatedData
	}

	const { needToleaveComment, ficPage } = await needToLeaveComment(page, fictionLink, 1)

	console.log('This is needToleaveComment', needToleaveComment)

	/**
	 * creeate new data
	 **/
	if (needToleaveComment) {
		// const leftComment = await leaveComment(ficPage)
		const leftComment = true

		if (leftComment) {
			commentsWritten++
		} else {
			return udpatedData
		}

		if (await isFirstPage(ficPage)) {
			return udpatedData
		}
		const previousChapterLink = await getPreviousChapterOfCurrentFic(ficPage)
		return await handleCommentRecurrsionLogic(ficPage, previousChapterLink, commentsWritten)
	}
	return udpatedData
}

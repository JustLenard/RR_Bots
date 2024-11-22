import { Page, test } from '@playwright/test'
import { getNextChapter as getNextChapterLink } from '../botLogic/getLinks'
import { leaveComment } from '../botLogic/leaveComment'
import { needToLeaveComment } from '../botLogic/needToLeaveComment'
import { MAIN_URL, MAX_PERMITTED_COMMENTS_PER_EXECUTION } from '../utils/constants'
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

	await page.goto(MAIN_URL)
	/**
	 * @todo remove this line later
	 **/
	try {
		await page.getByRole('button', { name: 'Accept' }).click()
	} catch {}

	await handleCommentRecurrsionLogic(page, fic[0], null)

	page.waitForTimeout(6000)
})

const handleCommentRecurrsionLogic = async (
	page: Page,
	fictionLink: string,
	lastReadChapterInfo: null | IChapterInfo,
	commentsWrittenAmount = 0,
	maxPermittedComments = MAX_PERMITTED_COMMENTS_PER_EXECUTION
): Promise<IChapterInfo> => {
	await page.goto(fictionLink)
	page.waitForTimeout(6000)

	const udpatedData = createChapterData(page.url())

	if (lastReadChapterInfo && lastReadChapterInfo.chapterId < udpatedData.chapterId) {
		return udpatedData
	}

	if (commentsWrittenAmount >= maxPermittedComments) {
		return udpatedData
	}

	const { needToleaveComment, ficPage } = await needToLeaveComment(page, fictionLink, 1)

	console.log('This is needToleaveComment', needToleaveComment)

	/**
	 * creeate new data
	 **/
	if (needToleaveComment) {
		const leftComment = await leaveComment(ficPage)
		page.waitForTimeout(6000)

		// const leftComment = true

		if (leftComment) {
			commentsWrittenAmount++
		} else {
			return udpatedData
		}

		const nextChapterLink = await getNextChapterLink(page)

		if (!nextChapterLink) {
			return udpatedData
		}

		return await handleCommentRecurrsionLogic(ficPage, nextChapterLink, lastReadChapterInfo, commentsWrittenAmount)
	}
	return udpatedData
}

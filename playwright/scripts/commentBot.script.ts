import { Page, test } from '@playwright/test'
import fs from 'fs'
import { getDataFromMyFollowList as getFictionDataFromMyFollowList } from '../botLogic/getDataFromMyFollowList'
import { getNextToCommentOnChapterLink, getPreviousChapterOfCurrentFic } from '../botLogic/getLinks'
import { MY_COMMENT, MY_USERNAME } from '../utils/constants'
import { createChpaterData } from '../utils/helpers'
import { IChapterInfo, ISaveFormat } from '../utils/types'

test('getMyFollowListData', async ({ page }) => {
	// fs.writeFileSync('data/fictions.json', JSON.stringify(fictionsInfo))

	// const needTocommentOnFictions = separateStuff(oldFic, fictionsInfo)

	// const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/581595/arc-1-chapter-5']
	const fictionsInfo = await getFictionDataFromMyFollowList(page)

	const fic = ['https://www.royalroad.com/fiction/26675/a-journey-of-black-and-red/chapter/396750/8-outside']

	const savedFictions: ISaveFormat = JSON.parse(fs.readFileSync('data/fictions.json', 'utf-8'))
	const jsonToSave: ISaveFormat = {}
	for (const fic of fictionsInfo) {
		const savedOldFic = savedFictions[fic.fictionId]

		if (savedFictions && savedOldFic) {
			const lastReadChapter = fic.lastReadChapter.chapterId
			const lastCommentedOnChapter = savedOldFic.lastCommentedOnChapter?.chapterId

			if (lastReadChapter === lastCommentedOnChapter) {
				jsonToSave[fic.fictionId].lastCommentedOnChapter = savedOldFic.lastCommentedOnChapter
				continue
			}
		}

		const nextToCommentOnChapterLink = await getNextToCommentOnChapterLink(page, fic)

		const newLastCommentedOnChater = await handleCommentRecurrsionLogic(page, nextToCommentOnChapterLink)
		jsonToSave[fic.fictionId].lastCommentedOnChapter = newLastCommentedOnChater
	}
	fs.writeFileSync('data/fictions2.json', JSON.stringify(jsonToSave), 'utf-8')
})

const handleCommentRecurrsionLogic = async (
	page: Page,
	fictionLink: string,
	commentsWritten = 0,
	maxCommentPermitted = 5
): Promise<IChapterInfo> => {
	const udpatedData = createChpaterData(page.url())

	if (commentsWritten >= maxCommentPermitted) {
		return udpatedData
	}

	const { needToleaveComment, ficPage } = await checkIfNeedToLeaveComment(page, fictionLink, 1)

	/**
	 * creeate new data
	 **/
	if (needToleaveComment) {
		const leftComment = await leaveComment(ficPage)

		if (leftComment) {
			commentsWritten++
		} else {
			return udpatedData
		}

		if (await isFirstPage(ficPage)) {
			return udpatedData
		}
		const previousChapterLink = await getPreviousChapterOfCurrentFic(ficPage)
		return handleCommentRecurrsionLogic(ficPage, previousChapterLink, commentsWritten)
	}
	return udpatedData
}

const isFirstPage = async (page: Page): Promise<boolean> => {
	const disabledPreviousChapterButton = page.getByRole('button', {
		disabled: true,
		name: '/Previous Chapter/',
	})
	return (await disabledPreviousChapterButton.count()) === 0 ? false : true
}

const leaveComment = async (page: Page): Promise<boolean> => {
	return true
}

const checkIfNeedToLeaveComment = async (
	page: Page,
	fictionLink: string,
	commentPage = 1
): Promise<{
	needToleaveComment: boolean
	ficPage: Page
}> => {
	await page.goto(`${fictionLink}?comments=${commentPage}`)
	const commentLoader = page.locator('#comment-loader')
	commentLoader.scrollIntoViewIfNeeded()
	await commentLoader.waitFor({ state: 'detached' })

	const divLocator = page.locator('.portlet-body.comments.comment-container')

	await page.waitForFunction(async (div) => {
		return div.children.length > 0
	}, await divLocator.elementHandle())

	const comments = await page.locator('.portlet-body.comments.comment-container > div').elementHandles()
	console.log('This is comments.length', (await comments).length)

	for (const commentDiv of comments) {
		const nameContainer = await commentDiv.$('.name')
		const commnetContainer = await commentDiv.$('.comment-body')
		if (nameContainer && commnetContainer) {
			const name = await nameContainer.textContent()
			const comment = await commnetContainer.textContent()
			console.log(`${name} : ${comment}`)

			if (name === MY_USERNAME && comment === MY_COMMENT) {
				return { needToleaveComment: false, ficPage: page }
			}
		}
	}

	if (await checkIfIsLastCommentPage(page)) {
		return { needToleaveComment: true, ficPage: page }
	}

	return checkIfNeedToLeaveComment(page, fictionLink, commentPage++)
}

const checkIfIsLastCommentPage = async (page: Page) => {
	const nexCommnetPageButton = page.getByRole('link', { name: 'Next ›' })
	const nextButtonExists = await nexCommnetPageButton.isVisible()
	return !nextButtonExists
}

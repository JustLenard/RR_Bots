import { test, expect, Page } from '@playwright/test'
import { IChapterInfo, IFictionInfo, ISaveFormat } from '../utils/types'
import { createChpaterData, separateStuff } from '../utils/helpers'
import fs from 'fs'
import { MAIN_URL, MY_COMMENT, MY_USERNAME } from '../utils/constants'

test('getMyFollowListData', async ({ page }) => {
	const fictionsInfo: IFictionInfo[] = []
	await page.goto('https://www.royalroad.com/my/follows')
	// await page.waitForSelector('button', { name: 'Accept' })
	await page.getByRole('button', { name: 'Accept' }).click()
	// await page.getByRole('button', { name: 'No' }).click()
	const res = await page.locator('.fiction-list-item.row')

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

	// fs.writeFileSync('data/fictions.json', JSON.stringify(fictionsInfo))

	// const needTocommentOnFictions = separateStuff(oldFic, fictionsInfo)

	// const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/581595/arc-1-chapter-5']
	const fic = ['https://www.royalroad.com/fiction/26675/a-journey-of-black-and-red/chapter/396750/8-outside']

	const oldFic: ISaveFormat = JSON.parse(fs.readFileSync('data/fictions.json', 'utf-8'))
	const jsonToSave: ISaveFormat = {}
	for (const fic of fictionsInfo) {
		const savedOldFic = oldFic[fic.fictionId]
		const startCommentingFrom = await getLinkToStartCommentingOn(page, fic)

		if (oldFic && savedOldFic) {
			const lastReadChapter = fic.lastReadChapter.chapterId
			const lastCommentedOnChapter = savedOldFic.lastCommentChapter?.chapterId

			if (lastReadChapter === lastCommentedOnChapter) {
				jsonToSave[fic.fictionId].lastCommentChapter = savedOldFic.lastCommentChapter
				continue
			}
		}
		const updatedFicInfo = await handleCommentRecurrsionLogic(page, startCommentingFrom)
		jsonToSave[fic.fictionId].lastCommentChapter = updatedFicInfo
	}
	fs.writeFileSync('data/fictions2.json', JSON.stringify(jsonToSave), 'utf-8')
})

const getLinkToStartCommentingOn = async (page: Page, fic: IFictionInfo): Promise<string> => {
	if (!fic.lastCommentChapter) {
		await page.goto(`${MAIN_URL}/fiction/${fic.fictionId}/${fic.nameInUrl}`)
		return `${MAIN_URL}/${await page
			.locator('.chapter-row')
			.first()
			.getByRole('link')
			.first()
			.getAttribute('href')}`
	} else {
		await page.goto(fic.lastCommentChapter.fullPath)
		return `${MAIN_URL}/${await page.getByRole('link', { name: '/Next Chapter/' }).first().getAttribute('href')}`
	}
}

const handleCommentRecurrsionLogic = async (
	page: Page,
	fictionLink: string,
	commentsWritten = 0,
	maxCommentPermitter = 5
): Promise<IChapterInfo> => {
	const udpatedData = createChpaterData(page.url())

	if (commentsWritten >= maxCommentPermitter) {
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

		if (isFirstPage(ficPage)) {
			return udpatedData
		}
		const previousChapterLink = clickPreviousChapterButton(ficPage)
		return handleCommentRecurrsionLogic(ficPage, previousChapterLink, commentsWritten)
	}
	return udpatedData
}

const clickPreviousChapterButton = (page: Page): string => {
	return 'link'
}

const isFirstPage = (page: Page): boolean => {
	return false
}

const leaveComment = async (page: Page): Promise<boolean> => {
	return true
}

const checkIfNeedToLeaveComment = async (
	page: Page,
	link: string,
	commentPage = 1
): Promise<{
	needToleaveComment: boolean
	ficPage: Page
}> => {
	await page.goto(`${link}?comments=${commentPage}`)
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

	return checkIfNeedToLeaveComment(page, link, commentPage++)
}

const checkIfIsLastCommentPage = async (page: Page) => {
	const nexCommnetPageButton = page.getByRole('link', { name: 'Next ›' })
	const nextButtonExists = await nexCommnetPageButton.isVisible()
	return !nextButtonExists
}

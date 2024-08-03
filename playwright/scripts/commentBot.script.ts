import { test, expect, Page } from '@playwright/test'
import { IFictionInfo } from '../utils/types'
import { createChpaterData, separateStuff } from '../utils/helpers'
import fs from 'fs'
import { MY_COMMENT, MY_USERNAME } from '../utils/constants'

test('getMyFollowListData', async ({ page }) => {
	const fictionsInfo: IFictionInfo[] = []
	// await page.goto('https://www.royalroad.com/my/follows')
	// // await page.waitForSelector('button', { name: 'Accept' })
	// await page.getByRole('button', { name: 'Accept' }).click()
	// // await page.getByRole('button', { name: 'No' }).click()
	// const res = await page.locator('.fiction-list-item.row')
	// for (const fictionContainer of await page.locator('.fiction-list-item.row').all()) {
	// 	const fictionInfo = {} as IFictionInfo
	// 	const title = (await fictionContainer.locator('.fiction-title').textContent())?.trim()
	// 	if (!title) throw Error(`Bad title ${title}`)
	// 	fictionInfo.name = title
	// 	const link = await fictionContainer.getByRole('link').first().getAttribute('href')
	// 	if (!link) throw Error(`Bad link ${link}`)
	// 	const splitLink = link.split('/')
	// 	fictionInfo.nameInUrl = splitLink[3]
	// 	fictionInfo.fictionId = Number(splitLink[2])
	// 	const listItemContainer = fictionContainer.locator('.list-item')
	// 	if ((await listItemContainer.count()) === 2) {
	// 		const length = await fictionContainer.locator('.list-item').count()
	// 		const newestChapter = await fictionContainer
	// 			.locator('.list-item')
	// 			.first()
	// 			.getByRole('link')
	// 			.getAttribute('href')
	// 		if (!newestChapter) throw Error(`Bad  ${newestChapter}`)
	// 		fictionInfo.newestChapter = createChpaterData(newestChapter)
	// 		const lastRead = await fictionContainer.locator('.list-item').last().getByRole('link').getAttribute('href')
	// 		if (!lastRead) throw Error(`Bad title name ${lastRead}`)
	// 		fictionInfo.lastReadChapter = createChpaterData(lastRead)
	// 	} else {
	// 		const lastReadAndLastPublished = await fictionContainer
	// 			.locator('.list-item')
	// 			.last()
	// 			.getByRole('link')
	// 			.getAttribute('href')
	// 		if (!lastReadAndLastPublished) throw Error(`Bad title name ${lastReadAndLastPublished}`)
	// 		fictionInfo.lastReadChapter = createChpaterData(lastReadAndLastPublished)
	// 		fictionInfo.newestChapter = createChpaterData(lastReadAndLastPublished)
	// 	}
	// 	fictionsInfo.push(fictionInfo)
	// }
	fs.writeFileSync('data/fictions.json', JSON.stringify(fictionsInfo))

	const oldFic = JSON.parse(fs.readFileSync('data/fictions.json', 'utf-8'))
	const needTocommentOnFictions = separateStuff(oldFic, fictionsInfo)

	const fic = ['https://www.royalroad.com/fiction/8694/a-story-in-black-and-white/chapter/581595/arc-1-chapter-5']

	await checkIfNeedToLeaveComment(page, fic[0])
})

const checkIfNeedToLeaveComment = async (page: Page, link: string) => {
	await page.goto(link)
	await page.locator('#comments').scrollIntoViewIfNeeded()
	const comments = await page.locator('.comments > div').elementHandles()
	console.log('This is comments', comments)
	console.log('This is comments.length', (await comments).length)

	let shouldLeaveComment = true

	for (const commentDiv of comments) {
		const nameContainer = await commentDiv.$('.name')
		const commnetContainer = await commentDiv.$('.comment-body')
		if (nameContainer && commnetContainer) {
			const name = await nameContainer.textContent()
			const comment = await commnetContainer.textContent()

			if (name === MY_USERNAME && comment === MY_COMMENT) {
				shouldLeaveComment = false
			}
		}
	}
	console.log('This is shouldLeaveComment', shouldLeaveComment)
}

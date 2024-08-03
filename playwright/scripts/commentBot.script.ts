import { test, expect } from '@playwright/test'
import { IFictionInfo } from '../utils/types'
import { createChpaterData } from '../utils/helpers'
import fs from 'fs'

const fictionsInfo: IFictionInfo[] = []

test('getMyFollowListData', async ({ page }) => {
	await page.goto('https://www.royalroad.com/my/follows')
	page.waitForTimeout(2000)
	console.log('hello')

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
	// fs.writeFileSync('data/fictions.json', JSON.stringify(fictionsInfo))
})

// const myArr = [1, 2, 3]

// myArr.forEach((el, i) => {
// 	test('check if you need to comment', async ({ page }) => {
// 		console.log('This is el', el)
// 	})
// })

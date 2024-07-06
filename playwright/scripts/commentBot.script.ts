import { test, expect } from '@playwright/test'

interface IFictionInfo {
	name: string
	nameInUrl: string
	id: number
	lastReadChapter: string
	newestChapter: string
}

test('test', async ({ page }) => {
	//   fiction - list - item

	await page.goto('https://www.royalroad.com/my/follows')
	// await page.waitForSelector('button', { name: 'Accept' })
	await page.getByRole('button', { name: 'Accept' }).click()
	// await page.getByRole('button', { name: 'No' }).click()
	const res = await page.locator('.fiction-list-item.row')

	const fictionsInfo: IFictionInfo[] = []

	// const fictionContainers = await page.locator('.fiction-list-item.row').all()

	// for (const li of await page.getByRole('listitem').all()) await li.click()

	// fictionContainers.slice(0, 1).forEach(async (fictionContainer) => {
	// 	const title = (await fictionContainer.locator('.fiction-title').textContent())?.trim()
	// 	console.log('This is title', title)
	// 	const link = await fictionContainer.getByRole('link').getAttribute('href')
	// 	console.log('This is link', link)
	// })
	for (const fictionContainer of await page.locator('.fiction-list-item.row').all()) {
		const fictionInfo = {} as IFictionInfo

		const title = (await fictionContainer.locator('.fiction-title').textContent())?.trim()
		if (!title) throw Error(`Bad title ${title}`)
		fictionInfo.name = title

		console.log('This is title', title)
		const link = await fictionContainer.getByRole('link').first().getAttribute('href')
		if (!link) throw Error(`Bad link ${link}`)

		console.log('This is link', link)

		const splitLink = link.split('/')
		fictionInfo.nameInUrl = splitLink[3]
		fictionInfo.id = Number(splitLink[2])

		console.log('This is link', link)

		const listItemContainer = fictionContainer.locator('.list-item')

		if ((await listItemContainer.count()) === 2) {
			const length = await fictionContainer.locator('.list-item').count()
			console.log('This is length', length)
			const newestChapter = await fictionContainer
				.locator('.list-item')
				.first()
				.getByRole('link')
				.getAttribute('href')
			if (!newestChapter) throw Error(`Bad  ${newestChapter}`)
			fictionInfo.newestChapter = newestChapter

			console.log('This is lastUpdate', newestChapter)
			const lastRead = await fictionContainer.locator('.list-item').last().getByRole('link').getAttribute('href')
			if (!lastRead) throw Error(`Bad title name ${lastRead}`)
			fictionInfo.lastReadChapter = lastRead

			console.log('This is lastRead', lastRead)
		} else {
			const lastReadAndLastPublished = await fictionContainer
				.locator('.list-item')
				.last()
				.getByRole('link')
				.getAttribute('href')
			if (!lastReadAndLastPublished) throw Error(`Bad title name ${lastReadAndLastPublished}`)
			fictionInfo.lastReadChapter = lastReadAndLastPublished
			fictionInfo.newestChapter = lastReadAndLastPublished
			console.log('This is lastReadAndLastPublished', lastReadAndLastPublished)
		}

		console.log('This is fictionInfo', fictionInfo)
		fictionsInfo.push(fictionInfo)
	}

	console.log('This is fictionsInfo', fictionsInfo)
	const fictionTitle = page.locator('link')

	Bun.write('../fictions/file.json', JSON.stringify(fictionTitle, null, 2))

	page.waitForTimeout(2000)
})

import fs from 'fs'
import { Page } from 'playwright'
import { MAIN_URL } from './constants'
import { IChapterInfo, IFictionInfo, ISaveFormat } from './types'

export const createChapterData = (newestChapter: string): IChapterInfo => {
	const temp = newestChapter.split('/')
	return {
		chapterId: Number(temp[5]),
		chapterName: temp[6],
		fullPath: `${MAIN_URL}${newestChapter}`,
	}
}

/**
 * Given the old array of fictions and the new one, return array
 * with fictions that has chapters that need to be commented on
 **/
export const separateStuff = (oldFictions: IFictionInfo[], newFictions: IFictionInfo[]) => {
	const mapping = new Set(oldFictions.map((fic) => fic.lastReadChapter.chapterId))
	return newFictions.filter((fiction) => !mapping.has(fiction.lastReadChapter.chapterId))
}

export const writeFicDataToFile = (fictions: IFictionInfo[]) => {
	const jsonToSave = {} as ISaveFormat

	fictions.forEach((fic) => {
		jsonToSave[fic.fictionId] = fic
	})
	fs.writeFileSync('data/fictions.json', JSON.stringify(jsonToSave))
}

// const getChapterFullPath = (fictionInfo: IFictionInfo) => {
// 	return `${MAIN_URL}/fiction/${fictionInfo.fictionId}/${fictionInfo.nameInUrl}/chapter/${}`
// }

export const randomNumberGenerator = (max: number, min: number = 0) => {
	return Number(Math.random() * (max - min) + min)
}

export const artificialWait = async (page: Page, max = 10000, min = 5000) => {
	const timeToWaitFor = randomNumberGenerator(max, min)
	await page.waitForTimeout(timeToWaitFor)
}

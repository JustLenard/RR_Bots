import { IfStatement } from 'typescript'
import { MAIN_URL } from './constants'
import { IFictionInfo } from './types'

export const createChpaterData = (newestChapter: string) => {
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

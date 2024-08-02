import { MAIN_URL } from './constants'

export const createChpaterData = (newestChapter: string) => {
	const temp = newestChapter.split('/')
	return {
		chapterId: Number(temp[5]),
		chapterName: temp[6],
		fullPath: `${MAIN_URL}${newestChapter}`,
	}
}

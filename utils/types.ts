export interface IChapterInfo {
	chapterId: number
	chapterName: string
	fullPath: string
}

export interface IFictionInfo {
	name: string
	nameInUrl: string
	fictionId: number
	lastReadChapter: IChapterInfo
	newestChapter: IChapterInfo
	lastCommentedOnChapter: IChapterInfo | null
}

export interface ISaveFormat {
	[key: string]: IFictionInfo
}

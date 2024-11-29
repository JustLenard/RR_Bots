import { Page } from '@playwright/test'
import { MY_COMMENT, MY_USERNAME } from '../utils/constants'
import { artificialWait } from '../utils/helpers'

export const needToLeaveComment = async (
	page: Page,
	fictionLink: string,
	commentPage = 1
): Promise<{
	needToleaveComment: boolean
	ficPage: Page
}> => {
	console.log(`Checking comment page ${commentPage}`)
	await loadComments(page)
	await artificialWait(page)
	// return { needToleaveComment: true, ficPage: page }

	const comments = await page.locator('.portlet-body.comments.comment-container > div').elementHandles()
	for (const commentDiv of comments) {
		const nameContainer = await commentDiv.$('.name')
		const commnetContainer = await commentDiv.$('.comment-body')
		if (nameContainer && commnetContainer) {
			const name = (await nameContainer.textContent())?.trim()
			console.log('This is name', name)
			const comment = (await commnetContainer.textContent())?.trim()
			console.log('This is comment', comment)
			if (name === MY_USERNAME && comment === MY_COMMENT) {
				return { needToleaveComment: false, ficPage: page }
			}
		}
	}

	console.log('This is await isLastCommentPage(page)', await isLastCommentPage(page))
	if (await isLastCommentPage(page)) {
		return { needToleaveComment: true, ficPage: page }
	}

	await page.goto(`${fictionLink}?comments=${commentPage + 1}`, { waitUntil: 'domcontentloaded' })

	return await needToLeaveComment(page, fictionLink, commentPage + 1)
}

const isLastCommentPage = async (page: Page) => {
	const lastCommnetPageButton = page.getByRole('link', { name: 'Last »' })
	const lastButtonExists = await lastCommnetPageButton.isVisible()
	return !lastButtonExists
}

const loadComments = async (page: Page) => {
	/**
	 * There is a placeholder div for the comments. Scroll to it.
	 * This will trigger the API call to get the comments.
	 * This placeholder div will dissaper after that
	 **/
	const commentLoader = page.locator('#comment-loader')
	commentLoader.scrollIntoViewIfNeeded()
	await commentLoader.waitFor({ state: 'hidden' })

	/**
	 * Get the comments container
	 **/
	const commentsContainer = page.locator('.portlet-body.comments.comment-container')

	/**
	 * Wait for the comments to get populated in the comments container
	 **/
	await page.waitForFunction((container) => container.children.length > 0, await commentsContainer.elementHandle())
}

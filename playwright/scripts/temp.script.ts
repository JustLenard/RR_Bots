import { test, expect } from '@playwright/test'
import { res } from './res'
import { build } from 'bun'

interface IFictionInfo {
	name: string
	nameInUrl: string
	id: number
	lastReadChapter: string
	newestChapter: string
}

test('temp', async ({ page }) => {
	console.log('This is res', res)
	console.log('This is build', build)
	// Bun.write('./file.json', JSON.stringify(res))
})

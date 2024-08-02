import { test, expect } from '@playwright/test'
import { res } from './res'
import * as fs from 'fs'

test('temp', async ({ page }) => {
	console.log('This is res', res)
	// Bun.write('./file.json', JSON.stringify(res))
	fs.writeFileSync('example.json', JSON.stringify(res))
})

import { test, expect } from '@playwright/test'
import { res } from './res'
import * as fs from 'fs'
import { separateStuff } from '../utils/helpers'

test('temp', async ({ page }) => {
	// console.log('This is res', res)
	const old = JSON.parse(fs.readFileSync('data/example.json', 'utf-8'))
	const newFic = JSON.parse(fs.readFileSync('data/fictions.json', 'utf-8'))

	console.log('This is old.length', old.length)
	console.log('This is newFic.length', newFic.length)
	const clean = separateStuff(old, newFic)
	console.log('This is clean.length', clean.length)
	console.log('This is clean', clean)
})

import fs from 'fs'

export const globalSetup = async () => {
	if (!fs.existsSync('./data')) {
		fs.mkdirSync('./data')
	}

	if (!fs.existsSync('./.auth')) {
		fs.mkdirSync('./.auth')
	}

	if (!fs.existsSync('./data/fictions.json')) {
		fs.writeFileSync('./data/fictions.json', '{}', 'utf-8')
	}
}

export default globalSetup

const { loginAsync } = require('./browser')

const fs = require('./fs')

module.exports = async (callback, params) => {
	console.log('登录Jenkins...')

	await fs.existsFile()

	loginAsync(async res => {
		console.log('登录Jenkins成功!')
		fs.writeFile()
		callback(params)
	})
}

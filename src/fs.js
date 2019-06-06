const fs = require('fs-extra')
const { join } = require('path')
const config = require('./config')
const loginPrompt = require('./prompt/loginPrompt')

/**
 * 判断本地文件存储
 */
const existsFile = async () => {
	if (!fs.existsSync(join(__dirname, '.local'))) {
		await loginPrompt()
	} else {
		const user = fs.readJsonSync(join(__dirname, '.local'))
		config.user.j_username = user.username
		config.user.j_password = user.password
		config.cookie = user.cookie
	}
}

/**
 * 写入登录信息
 */
const writeFile = () => {
	fs.writeJsonSync(
		join(__dirname, '.local'),
		{
			username: config.user.j_username,
			password: config.user.j_password,
			cookie: config.cookie
		},
		err => {
			if (err) return console.error(err)
		}
	)
}

const removeFile = () => {
	fs.removeSync(join(__dirname, '.local'))
}

module.exports = {
	existsFile,
	writeFile,
	removeFile
}

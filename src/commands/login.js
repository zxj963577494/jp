const { Command } = require('@oclif/command')
const chalk = require('chalk')
const { loginAsync } = require('../browser')
const loginPrompt = require('../prompt/loginPrompt')
const fs = require('../fs')
const loginWrap = require('../loginWrap')

class LoginCommand extends Command {
	async run() {
		fs.removeFile()
		loginWrap(() => {
			console.log(`猜你接下来想执行发布：${chalk.yellow('jp publish')}`)
		})
	}
}

LoginCommand.description = `更换jenkins账户`

module.exports = LoginCommand

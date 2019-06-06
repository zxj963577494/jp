const { Command, flags } = require('@oclif/command')
const cli = require('../cli')
const fastCli = require('../fastCli')
const loginWrap = require('../loginWrap')
const confirmPrompt = require('../prompt/confirmPrompt')

class PublishCommand extends Command {
	async run() {
		const { flags } = this.parse(PublishCommand)
		if (flags.env && flags.project) {
			const { confirmAnswers } = await confirmPrompt()

			if (!confirmAnswers.confirm) {
				console.log('已取消发布')
				process.exit(0)
			}

			loginWrap(fastCli, flags)
		} else {
			loginWrap(cli)
		}
	}
}

PublishCommand.description = `发布jenkins项目`

PublishCommand.flags = {
	env: flags.string({ description: 'jenkins发布环境' }),
	project: flags.string({ description: 'jenkins发布项目' }),
	params: flags.string({ description: 'jenkins发布参数' })
}

module.exports = PublishCommand

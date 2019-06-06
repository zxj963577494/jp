const { Command, flags } = require('@oclif/command')
const progress = require('../progress')
const loginWrap = require('../loginWrap')

class ProgressCommand extends Command {
	async run() {
		const { flags } = this.parse(ProgressCommand)
		if (flags.env && flags.project) {
			loginWrap(progress, flags)
		}
	}
}

ProgressCommand.description = `获取jenkins最后一次构建信息`

ProgressCommand.flags = {
	env: flags.string({ description: 'jenkins发布环境' }),
	project: flags.string({ description: 'jenkins发布项目' })
}

module.exports = ProgressCommand

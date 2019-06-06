const chalk = require('chalk')
const qs = require('qs')
const envPrompt = require('./prompt/envPrompt')
const projectPrompt = require('./prompt/projectPrompt')
const paramsPrompt = require('./prompt/paramsPrompt')
const build = require('./build')
const progress = require('./progress')
const config = require('./config')

module.exports = async () => {
	/**
	 * 环境
	 */
	const { envAnswers, currentEnv } = await envPrompt({
		url: config.urls.group
	})

	/**
	 * 项目
	 */
	const { projectAnswers, currentProject } = await projectPrompt({
		url: currentEnv.link
	})

	/**
	 * 参数
	 */
	const { paramsAnswers, transAnswers } = await paramsPrompt({
		url: currentProject.link
	})

	const { result } = await build({
		url: currentProject.link,
		params: transAnswers
	})

	if (result) {
		console.log(`\n jenkins 发布启动成功 🎉`)
	} else {
		console.log(`\n jenkins 发布启动失败 ❌`)
	}

	const answers = {
		...envAnswers,
		...projectAnswers,
		params: decodeURIComponent(qs.stringify(paramsAnswers, { delimiter: ',' }))
	}

	const commander = `jp publish --env=${answers.env} --project=${
		answers.project
	} --params=${answers.params}`

	console.log('\n 下次可以直接使用以下命令：')

	console.log(`\n ${chalk.yellow(commander)}`)

	console.log()

	progress({
		env: answers.env,
		project: answers.project
	})
}

const ora = require('ora')
const terminalLink = require('terminal-link')
const { getCrumbAsync, postProgressAsync } = require('./browser')
const config = require('./config')

module.exports = async flags => {
	const spinner = ora()

	spinner.start()

	spinner.color = 'yellow'
	spinner.text = '正在获取jenkins构建信息...'

	const timer = setInterval(async () => {
		const crumb = await getCrumbAsync()

		const response = await postProgressAsync(flags.env, flags.project, crumb)

		const url = `${config.urls.group}job/${flags.env}/job/${flags.project}/`
		const link = terminalLink('网页端', url)

		if (response) {
			spinner.text = 'jenkins构建中...'
			if (response.result === 'SUCCESS') {
				spinner.succeed('jenkins构建成功')
				clearInterval(timer)
			} else if (response.result === 'UNSTABLE') {
				spinner.succeed('jenkins构建成功，但有一些警告')
				clearInterval(timer)
			} else if (response.result === 'ABORTED') {
				spinner.fail('jenkins构建已终止')
				clearInterval(timer)
			} else if (response.result === 'FAILURE') {
				spinner.fail('jenkins构建失败')
				clearInterval(timer)
			} else if (response.result === null) {
				spinner.text = 'jenkins构建中...'
			} else {
				spinner.succeed(`未知结果，请前往${link}查看`)
				clearInterval(timer)
			}
		} else {
			spinner.fail(`获取最后一次构建信息出错，请前往${link}查看`)
			clearInterval(timer)
		}
	}, 10000)
}

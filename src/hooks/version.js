const chalk = require('chalk')
const updateNotifier = require('@hspkg/update-notifier')
const pkg = require('../../package.json')

module.exports = async () => {
	const notifier = updateNotifier({
		registry: 'https://registry.npmjs.org'
	})({
		pkg,
		updateCheckInterval: 0,
		shouldNotifyInNpmScript: true
	})

	notifier.update &&
		notifier.notify({
			message: `发现新版本 ${chalk.gray(
				notifier.update.current
			)} -> ${chalk.green(notifier.update.latest)}
运行 ${chalk.cyan('yarn global add ') + notifier.packageName} 更新`
		})
}

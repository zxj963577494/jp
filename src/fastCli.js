const qs = require('qs')
const { checkUrlAsync, getParamsAsync, getBranchAsync } = require('./browser')
const build = require('./build')
const progress = require('./progress')
const config = require('./config')

module.exports = async flags => {
	const url = `${config.urls.group}job/${flags.env}/job/${flags.project}/`

	const isExist = await checkUrlAsync(url)

	if (!isExist) {
		console.log('项目地址错误，请检查后重试')
		process.exit(0)
	}

	const response = await getParamsAsync(url)

	const branch = await getBranchAsync(url)

	const trans = response.map(x => {
		if (x.name === 'branch') {
			return {
				...x,
				list: branch.values
			}
		}
		return x
	})

	const params = qs.parse(flags.params, { delimiter: ',' })

	try {
		for (const key in params) {
			params[key] = trans
				.filter(x => x.name === key)[0]
				.list.filter(x => x.name === params[key])[0].value
		}
	} catch (error) {
		console.log('参数错误，请检查后重试')
		progress.exit(0)
	}

	const { result } = await build({
		url: url,
		params
	})

	if (result) {
		console.log(`\n jenkins 发布启动成功 🎉`)
	} else {
		console.log(`\n jenkins 发布启动失败 ❌`)
	}

	console.log()

	progress({
		env: flags.env,
		project: flags.project
	})
}

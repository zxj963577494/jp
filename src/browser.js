const chalk = require('chalk')
const request = require('superagent')
const cheerio = require('cheerio')
const qs = require('qs')
const config = require('./config')

/**
 * 检查网址是否正常读取，保证URL正确
 * @param {*} url
 */
const checkUrlAsync = url => {
	return request
		.get(url)
		.set('Cookie', config.cookie)
		.then(
			res => {
				return true
			},
			err => {
				return false
			}
		)
}

/**
 * 登录
 */
const loginAsync = callback => {
	request
		.post(config.urls.check)
		.type('form')
		.send(config.user)
		.redirects(0)
		.end((err, res) => {
			if (err) {
				if (
					err.response.statusCode === 302 &&
					res.header['set-cookie']
						.join(',')
						.indexOf('ACEGI_SECURITY_HASHED_REMEMBER_ME_COOKIE') === -1
				) {
					config.cookie = res.header['set-cookie']
					callback(res)
				} else {
					console.log('\n 登录Jenkins失败，请重新登录')
					console.log(`\n 可以使用 ${chalk.yellow('jp login')} 重新登录`)
					console.log()
					return false
				}
			}
		})
}

/**
 * 获取环境列表
 * @param {string} url 环境页
 */
const getEnvsAsync = url => {
	return request
		.get(url)
		.set('Cookie', config.cookie)
		.then(res => {
			const $ = cheerio.load(res.text)
			const items = []
			$('#projectstatus .model-link.inside').each((index, element) => {
				var $element = $(element)
				items.push({
					index: index,
					value: $element.text(),
					link: config.urls.group + $element.attr('href')
				})
			})
			return items
		})
}

/**
 * 获取项目列表
 * @param {string} url 项目列表页
 */
const getProjectsAsync = url => {
	return request
		.get(url)
		.set('Cookie', config.cookie)
		.then(res => {
			const $ = cheerio.load(res.text)
			const items = []
			$('#projectstatus td')
				.not(function(i, el) {
					return $(this).attr('data')
				})
				.find('.model-link.inside')
				.each(function(index, element) {
					var $element = $(element)
					items.push({
						index: index,
						value: $element.text(),
						link: url + $element.attr('href')
					})
				})
			return items
		})
}

/**
 * 获取工程配置参数列表
 * @param {string} url build页
 */
const getParamsAsync = url => {
	const endUrl = url + 'build'
	return request
		.get(endUrl)
		.set('Cookie', config.cookie)
		.then(
			res => {},
			error => {
				const res = error.response
				const $ = cheerio.load(res.text)
				let name = ''
				let item = null
				let list = []
				const items = []
				$('table.parameters tbody')
					.filter((i, tele) => {
						/**
						 * 过滤最后一个tbody
						 */
						const $tele = $(tele)
						return $tele.children('tr').children().length > 2
					})
					.each(function(ii, bodyElement) {
						const $bodyElement = $(bodyElement)
						$bodyElement
							.children('tr')
							.first()
							.filter(function(i, ele) {
								/**
								 * 过滤最后一个tr
								 */
								return $(ele).children().length > 3
							})
							.children()
							.each(function(index, element) {
								const $ele = $(element)
								list = []
								if (
									$ele.hasClass('setting-name') ||
									$ele.hasClass('setting-main')
								) {
									if ($ele.hasClass('setting-name')) {
										name = $ele.text()
									}
									if ($ele.hasClass('setting-main')) {
										$ele.find('option').each((i, op) => {
											const $op = $(op)
											list.push({
												index: i,
												name: $op.text(),
												value: $op.val()
											})
										})
									}
									item = {
										index,
										name,
										list
									}
								}
							})
						items.push(item)
					})
				return items
			}
		)
}

/**
 * 获取当前项目分支列表
 * @param {string} url
 */
const getBranchAsync = url => {
	const endUrl =
		url +
		'/descriptorByName/net.uaznia.lukanus.hudson.plugins.gitparameter.GitParameterDefinition/fillValueItems?param=branch'
	return request
		.get(endUrl)
		.set('Cookie', config.cookie)
		.then(res => {
			return JSON.parse(res.text)
		})
}

/**
 * 获取当前登录Crumb
 */
const getCrumbAsync = () => {
	const url = `http://${config.user.j_username}:${
		config.user.j_password
	}@YOUR JENKINS SITE/crumbIssuer/api/json`
	return request.get(url).then(res => {
		const { crumb } = JSON.parse(res.text)
		return crumb
	})
}

/**
 * Build
 * @param {string} url
 * @param {string} crumb
 * @param {object} params
 */
const postBuildAsync = (url, crumb, params) => {
	const endUrl =
		url.replace(
			'YOUR JENKINS SITE',
			`${config.user.j_username}:${config.user.j_password}@YOUR JENKINS SITE`
		) + 'buildWithParameters?'

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Jenkins-Crumb': crumb
	}

	return request
		.post(endUrl + qs.stringify(params))
		.set(headers)
		.then(
			res => {
				return true
			},
			error => {
				return false
			}
		)
}

/**
 * build进度
 * @param {string} url
 * @param {string} crumb
 */
const postProgressAsync = (env, project, crumb) => {
	const endUrl =
		`${config.urls.group}job/${env}/job/${project}/`.replace(
			'YOUR JENKINS SITE',
			`${config.user.j_username}:${config.user.j_password}@YOUR JENKINS SITE`
		) + '/lastBuild/api/json?tree=result,timestamp,estimatedDuration'

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Jenkins-Crumb': crumb
	}

	return request
		.post(endUrl)
		.set(headers)
		.then(
			res => {
				return JSON.parse(res.text)
			},
			error => {
				return false
			}
		)
}

module.exports = {
	checkUrlAsync,
	loginAsync,
	getEnvsAsync,
	getProjectsAsync,
	getParamsAsync,
	getBranchAsync,
	getCrumbAsync,
	postBuildAsync,
	postProgressAsync
}

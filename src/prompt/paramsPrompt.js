'use strict'
const inquirer = require('inquirer')
const _ = require('lodash')
const fuzzy = require('fuzzy')
const { getParamsAsync, getBranchAsync } = require('../browser')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

module.exports = async ({ url }) => {
	const response = await getParamsAsync(url)
	const branch = await getBranchAsync(url)

	const result = response.map(x => {
		if (x.name === 'branch') {
			return {
				...x,
				list: branch.values
			}
		}
		return x
	})

	function getCurrentName(answers) {
		const values = _.keys(answers)
		const resultOfName = result.map(x => x.name)
		return _.difference(resultOfName, values)[0]
	}

	function searchProject(answers, input) {
		const name = getCurrentName(answers)
		input = input || ''
		return new Promise(function(resolve) {
			setTimeout(function() {
				var fuzzyResult = fuzzy.filter(
					input,
					result.filter(x => x.name === name)[0].list.map(y => y.name)
				)
				resolve(
					fuzzyResult.map(function(el) {
						return el.original
					})
				)
			}, _.random(30, 500))
		})
	}

	const prompts = result.map(x => {
		return {
			type: 'autocomplete',
			name: x.name,
			message: '请选择需要发布的' + x.name,
			source: searchProject
		}
	})

	const answers = await inquirer.prompt(prompts)

	const transAnswers = {}

	for (const key in answers) {
		transAnswers[key] = result
			.filter(x => x.name === key)[0]
			.list.filter(x => x.name === answers[key])[0].value
	}

	return {
		paramsAnswers: answers,
		transAnswers
	}
}

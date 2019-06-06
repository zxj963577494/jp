'use strict'
const inquirer = require('inquirer')
const _ = require('lodash')
const fuzzy = require('fuzzy')
const { getProjectsAsync } = require('../browser')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

module.exports = async ({ url }) => {
	const response = await getProjectsAsync(url)

	function searchProject(answers, input) {
		input = input || ''
		return new Promise(function(resolve) {
			setTimeout(function() {
				var fuzzyResult = fuzzy.filter(input, response.map(x => x.value))
				resolve(
					fuzzyResult.map(function(el) {
						return el.original
					})
				)
			}, _.random(30, 500))
		})
	}

	const prompts = [
		{
			type: 'autocomplete',
			name: 'project',
			message: '请选择需要发布的项目',
			source: searchProject
		}
	]

	const projectAnswers = await inquirer.prompt(prompts)

	const currentProject = response.filter(x => {
		return x.value === projectAnswers.project
	})[0]

	return {
		projectAnswers,
		currentProject
	}
}

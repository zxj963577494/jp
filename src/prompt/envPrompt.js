'use strict'
const inquirer = require('inquirer')
const { getEnvsAsync } = require('../browser')

module.exports = async ({ url }) => {
	const response = await getEnvsAsync(url)
	const prompts = [
		{
			type: 'list',
			name: 'env',
			message: '请选择需要发布的环境',
			choices: response.map(data => ({
				name: data.value,
				value: data.value
			}))
		}
	]

	const envAnswers = await inquirer.prompt(prompts)

	const currentEnv = response.filter(x => {
		return x.value === envAnswers.env
	})[0]

	return {
		envAnswers,
		currentEnv
	}
}

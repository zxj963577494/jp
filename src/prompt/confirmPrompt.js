'use strict'
const inquirer = require('inquirer')

module.exports = async () => {
	const prompts = [
		{
			type: 'confirm',
			name: 'confirm',
			message: '是否确认发布？',
			default: false
		}
	]

	const confirmAnswers = await inquirer.prompt(prompts)

	return {
		confirmAnswers
	}
}

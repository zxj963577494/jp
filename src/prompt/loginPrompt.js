'use strict'
const inquirer = require('inquirer')
const config = require('../config')

module.exports = async () => {
	const prompts = [
		{
			type: 'input',
			name: 'username',
			message: '请输入Jenkins账号'
		},
		{
			type: 'password',
			name: 'password',
			message: '请输入Jenkins密码'
		}
	]

	const loginAnswers = await inquirer.prompt(prompts)

	config.user.j_username = loginAnswers.username
	config.user.j_password = loginAnswers.password

	return {
		loginAnswers
	}
}

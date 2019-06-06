const config = {
	urls: {
		check: 'http://YOUR JENKINS SITE/j_acegi_security_check',
		login: 'http://YOUR JENKINS SITE/login',
		home: 'http://YOUR JENKINS SITE/',
		group: 'http://YOUR JENKINS SITE/view/group/'
	},
	user: {
		j_username: '',
		j_password: '',
		from: '',
		Submit: 'Sign in'
	},
	cookie: ''
}

module.exports = config

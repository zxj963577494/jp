'use strict'
const { getCrumbAsync, postBuildAsync } = require('./browser')

module.exports = async ({ url, params }) => {
	const crumb = await getCrumbAsync()
	const result = await postBuildAsync(url, crumb, params)

	return {
		result
	}
}

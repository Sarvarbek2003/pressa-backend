const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		const { adminId, agent } = jwt.verify(req.headers.token, 'PRESSA')

		if(req['headers']['user-agent'] != agent) {
			throw new Error("Token is sent from wrong device!")
		}

		req.adminId = adminId

		return next()

	} catch(error) {
		res.status(401).json({ message: error.message })
	}
}
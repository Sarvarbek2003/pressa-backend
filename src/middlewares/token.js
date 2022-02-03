const jwt = require('jsonwebtoken')
const { ClientError } = require('../utils/error.js')


module.exports = (req, res, next) => { 
	try {
		const { adminId, agent } = jwt.verify(req.headers.token, 'PRESSA')

		if(req['headers']['user-agent'] != agent) {
			throw new ClientError(401, "Token is sent from wrong device!")
		}

		req.adminId = adminId

		return next()

	} catch(error) {
		return res.status(401).json({message: 'Invalig token'})
	}
}
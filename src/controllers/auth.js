const { ClientError } = require('../utils/error.js')
const sha256 = require('sha256')

const LOGIN = (req, res, next) => {
	try {
		const { username, password } = req.body
		if(!username || !password) throw new ClientError(400, "username and password are required!")

		const users = req.select('admin')
		const user = users.find(user => user.username == username && user.password == sha256(password))

		if(!user) throw new ClientError(404, "Wrong username or password!")

		delete user.password
		return res.status(200).json({
			user,
			message: "The user has successfully logged in!",
		})
		
	} catch(error) {
		return next(error)
	}
}

module.exports = {
	LOGIN, 
}
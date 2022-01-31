const { ClientError } = require('../utils/error.js')
const jwt = require('jsonwebtoken')
const sha256 = require('sha256')
const axios = require('axios')
let admin_id
let code 

const LOGIN = async(req, res, next) => {
	try {
		const { username, password } = req.body

		if(!username || !password) throw new ClientError(400, "username and password are required!")

		const users = req.select('admin')
		const user = users.find(user => user.username == username && user.password == sha256(password))

		if(!user) throw new ClientError(404, "Wrong username or password!")

		code = Math.random() * 1000000 | 0
		admin_id = user.adminId
		
		await axios.get('https://api.telegram.org/bot5057668685:AAFc4ELEfQFSHYQKA6aeTs2lpEtCrhafdo4/sendMessage?chat_id=' + user.adminId+'&text=Sizning tasdiqlash kodinggiz: ' + code)

		return res.status(200).json({
			status: 200,
			message: "Yuborilgan kodni kiriting!"
		})
		
	} catch(error) {
		return next(error)
	}
}

const CODE = (req,res)=>{
	const { kod } = req.body
	if (code == kod){
		return res.status(200).json({
			status: 200,
			message: "The user has successfully logged in!",
			token: jwt.sign({ adminId: admin_id, agent: req['headers']['user-agent'] }, 'PRESSA', { expiresIn: '12h' })
		})
	}else{
		return res.json({
			status: 400,
			message: "Tasdiqlash kodo noto`gri"
		})	
	}

}

module.exports = {
	LOGIN, 
	CODE
}
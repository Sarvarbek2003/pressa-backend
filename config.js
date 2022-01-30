require('dotenv').config()


const PORT = process.env.PORT || 5005


const PAGINATION = {
	page: 1,
	limit: 24
}

module.exports = {
	PAGINATION,
	PORT
}
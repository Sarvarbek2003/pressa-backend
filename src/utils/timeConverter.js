const { date } = require("joi")

module.exports = (time) => {
	const [date, month, year] = new Date(time).toLocaleDateString("uz-UZ").split("/")
	const [hour, minute] = new Date(time).toLocaleTimeString("uz-UZ").split(/:| /)

	return {
		"year": year,
		"month": month,
		"date": date,
		"hour": hour,
		"minute": minute,
		"filter": year+month+date+hour+minute
	}
}



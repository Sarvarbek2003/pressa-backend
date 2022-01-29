const { ServerError } = require('./utils/error.js')
const timeConverter = require('./utils/timeConverter.js')
const { PORT } = require('../config.js')
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express()

const modelMiddleware = require('./middlewares/model.js')
const paginationMiddleware = require('./middlewares/pagination.js')
const validation = require('./middlewares/validation.js')

app.use(cors({
  	origin: "*",
  	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  	preflightContinue: false
}))

app.use(express.json())
app.use(modelMiddleware)
app.use(paginationMiddleware)
app.use(express.static(path.join(process.cwd(), 'files')))

const announcementsRouter = require('./routes/announcements.js')
const addAnnouncements = require('./controllers/announcements.js')
const authRouter = require('./routes/auth.js')


app.post('/add',validation.announcementValidation,addAnnouncements.POST)
app.use('/announcements', announcementsRouter)
app.use('/admin/auth', authRouter)

app.use((error, req, res, next) => {
	if([400, 401, 404, 413, 415].includes(error.status)) {
		return res.status(error.status).send(error)
	} 
	
	fs.appendFileSync(
		path.join(process.cwd(), 'log.txt'),
		`${timeConverter(new Date())}  ${req.method}  ${req.url}  "${error.message}"\n`
	)

	return res.status(500).send(new ServerError(""))
})


function ValidateEmail(mail) 
{
 if (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(mail))
  {
    return (true)
  }
    return (false)
}

console.log(timeConverter('2021-12-31T10:00'))

app.listen(PORT, () => console.log('server is running on http://localhost:' + PORT))
const { ServerError } = require('./utils/error.js')
const fileUpload = require('express-fileupload')
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
const controller = require('./controllers/auth.js')


app.use(fileUpload())
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
const adminRout = require('./routes/admin.js')
const authRouter = require('./routes/auth.js')

const addAnnouncements = require('./controllers/announcements.js')


app.post('/add',validation.announcementValidation, addAnnouncements.POST)
app.put('/views', addAnnouncements.PUT)


app.use('/announcements', announcementsRouter)
app.use('/auth', authRouter)
app.use('/admin', adminRout)



app.use((error, req, res, next) => {
	if([400, 401, 404, 413, 415].includes(error.status)) {
		return res.status(error.status).send(error)
	} 
	let { year, month, date, hour, minute } = timeConverter(new Date())
	fs.appendFileSync(
		path.join(process.cwd(), 'log.txt'),
		`${date+'/'+month+'/'+year+' | '+hour+':'+minute}  ${req.method}  ${req.url}  "${error.message}"\n`
	)

	return res.status(500).send(new ServerError(""))
})



setInterval(async() => {
	// await sal()
}, 500);
app.listen(PORT, () => console.log('server is running on http://localhost:' + PORT))
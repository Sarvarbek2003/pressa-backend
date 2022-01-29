const timeConverter = require('../utils/timeConverter.js')
const { ClientError } = require('../utils/error.js')
let d = new Date()


const GET = (req, res, next) => {
	try {
		const { postId } = req.params
		const { page = req.PAGINATION.page, limit = req.PAGINATION.limit } = req.query

		let announcements = req.select('announcements')
		let categoriya = req.select('cartegoriya')
		

		if(postId) {
			const announcement = announcements.find(announcement => announcement.ID == postId)
			return res.json(announcement)
		} else {
			const paginatedUsers = announcements.slice(page * limit - limit, limit * page)
			const acceptedUser = announcements.filter(announcement => {
				if(announcement.result == 'accepted'){
					delete announcement.phoneNumber
					delete announcement.eventname
					delete announcement.info
					delete announcement.messId
					delete announcement.link
					delete announcement.result
					announcement.time = timeConverter(announcement.time)
					return announcement
				}
			})

			return res.json({users:acceptedUser ,cart:categoriya})
		}

	} catch(error) {
		return next(error)
	}
}

const POST = (req, res, next) => {
	try {
		const { img, profilImg} = req.files
		const { name, surname, phoneNumber, kartegoriya, supkartegoriya, title, type, link, info, yonalish, email, date} = req.body

		const announcements = req.select('announcements')

		const prolilimg = profilImg.name.replace(/\s/g, '')
		files.mv( path.join(process.cwd(), 'files', 'profilimg', d.getTime() + prolilimg) )

		const imageName = img.name.replace(/\s/g, '')
		files.mv( path.join(process.cwd(), 'files','img', d.getTime() + imageName) )

		let ID = announcements.length ? announcements[announcements.length - 1].ID + 1 : 1

		let newAnnouncement = {
			ID,
			type,
			name,
			surname,
			yonalish,
			email,
			phoneNumber,
			date,
			kartegoriya,
			supkartegoriya,
			link,
			imgUrl: '/img/' + d.getTime() + imageName,
			profilImg: '/profilImg/' + d.getTime() + prolilimg,
			title,
			info
		}

		let template = []
		
		users.push(newUser)

		req.insert('users', users)
		req.postmessage(useId, template)

		res.status(201).json({
			userId: newUser.userId,
			message: "The user successfully registered!",
			token: jwt.sign({ userId: newUser.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY', { expiresIn: '10h' })
		})

	} catch(error) {
		return next(error)
	}
}


module.exports = {
	GET,
	POST
}

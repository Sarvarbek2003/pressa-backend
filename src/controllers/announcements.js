const timeConverter = require('../utils/timeConverter.js')
const axios = require('axios')

const path = require('path')
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
			const acceptedUser = announcements.filter(announcement => {
				if(announcement.result == 'accepted'){
					delete announcement.phoneNumber
					delete announcement.info
					delete announcement.messId
					delete announcement.link
					delete announcement.result
					announcement.time = timeConverter(announcement.time)
					return announcement
				}
			})
			acceptedUser.sort((a,b) =>  a.time.filter - b.time.filter)
			const paginatedUsers = acceptedUser.slice(page * limit - limit, limit * page)
			 res.json({users:paginatedUsers ,cart:categoriya})
		}

	} catch(error) {
		return next(error)
	}
}

const DAT = (req, res, next) => {
	try {
	
		let announcements = req.select('announcements')

		const acceptedUser = announcements.filter(announcement => {
			if(announcement.result == 'accepted'){
				announcement.time = timeConverter(announcement.time)
				return announcement
			}
		})

		acceptedUser.sort((a,b) =>  a.time.filter - b.time.filter)
		return res.json(acceptedUser)
		
	} catch(error) {
		return next(error)
	}
}

const POST = async(req, res, next) => {
	try {
		const { imgUrl, personImgUrl} = req.files
		const { name, phoneNumber, kartegoriya, online, supkartegoriya, title, descripion, link, info, direction, email, date, time} = req.body

		const announcements = req.select('announcements')

		const prolilimg = personImgUrl.name.replace(/\s/g, '')
		personImgUrl.mv( path.join(process.cwd(), 'files', 'profilImg', d.getTime() + prolilimg) )

		const imageName = imgUrl.name.replace(/\s/g, '')
		imgUrl.mv( path.join(process.cwd(), 'files','img', d.getTime() + imageName) )

		let ID = announcements.length ? announcements[announcements.length - 1].ID + 1 : 1
		let timeDate = date + 'T' + time

		let newAnnouncement = {
			ID,
			name,
			direction,
			email,
			phoneNumber,
			time: new Date(timeDate),
			kartegoriya,
			supkartegoriya,
			link,
			imgUrl: '/img/' + d.getTime() + imageName,
			personImgUrl: '/profilImg/' + d.getTime() + prolilimg,
			descripion,
			title,
			info,
			messId: 0,
			view: 0,
			online,
			result: "accepted"
		}

		let tgPost = `
🎯Yangi elon keldi

✈️${newAnnouncement.title}

📑${newAnnouncement.descripion}

📞 +${newAnnouncement.phoneNumber}
https://`
		
		let options = {
			method: 'GET',
			url: 'https://api.telegram.org/bot5057668685:AAFc4ELEfQFSHYQKA6aeTs2lpEtCrhafdo4/sendMessage',
			
			data:{
				chat_id: '1228852253',
				text: tgPost
			}
			
		};
		let mesaId = await axios.request(options)
		

		announcements.push(newAnnouncement)

		req.insert('announcements', announcements)
		
		res.status(201).json({
			message: "Accepted please wait for confirmation!!",
		})
		
	} catch(error) {
		return next(error)
	}
}

module.exports = {
	GET,
	POST,
	DAT,

}

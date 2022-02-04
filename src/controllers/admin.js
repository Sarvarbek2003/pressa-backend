const  timeConverter  = require("../utils/timeConverter")

const PUT = async(req, res, next) => {
    try{
        const  { ID, result} = req.body

        if(!ID && !reult) return

        let announcements = req.select('announcements')

        announcements.forEach(el => {
            if(+el.ID == +ID) {
                el.result = result
            }
        })

        await req.insert('announcements',announcements)

        res.status(200).json({messag: 'OK'})
    }catch (error){
        return next(error)
    }
}

const GET = (req, res, next) => {
	try {
        let announcements = req.select('announcements')
		let acceptedUser = announcements.filter(announcement => {
			if(announcement.result == 'accepted' || announcement.result == 'rejected' || announcement.result == 'pending'){
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

module.exports = {
    PUT,
    GET
}
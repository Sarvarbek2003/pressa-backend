const  timeConverter  = require("../utils/timeConverter")
const axios = require('axios')
let id = 0

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

        let obj = announcements.find(el =>  el.ID == ID)

        if (obj.result == 'accepted') id = botSend(obj)

        announcements.forEach(el => {
            if(+el.ID == +ID) {
                el.messId = id
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

async function botSend(obj) {
    try{
        let {ID, name, title , descripion,imgUrl} = obj

        let POST = `
🎯 Yangi elon keldi

✈️ ${title}

📑 ${description}

👉 <a href="https://pressauz.herokuapp.com/announcement/${ID}">BATAFSIL</a>
        `
        let options = {
            method: 'GET',
            url: 'https://api.telegram.org/bot5057668685:AAFc4ELEfQFSHYQKA6aeTs2lpEtCrhafdo4/sendPhoto',
            data:{
                chat_id: '-1001763280116',
                photo: 'https://pressa-uz.herokuapp.com' + imgUrl,
                caption: POST,
                parse_mode: 'HTML'
            }
        }
        let res = await axios.request(options)
        return res.data.result.message_id   
    } catch (error) {
        axios.get('https://api.telegram.org/bot5057668685:AAFc4ELEfQFSHYQKA6aeTs2lpEtCrhafdo4/sendMessage?chat_id=887528138&text=Xatolik')
    }
}

module.exports = {
    PUT,
    GET
}

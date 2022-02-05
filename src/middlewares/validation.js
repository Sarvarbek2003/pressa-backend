const Joi = require('joi')
const { ClientError } = require('../utils/error.js')

const annoValidation = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(/^998[3789][012345789][0-9]{7}$/)).required(),
    email: Joi.string().pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).required(),
    time: Joi.string().pattern(new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)).required(),
    date: Joi.string().pattern(new RegExp(/^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/)).required(),
    name: Joi.string().max(50).required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    title: Joi.string().max(40).required(),
    info: Joi.string().max(200).required(),
    online: Joi.string().max(200).required(),
    direction: Joi.string().max(200).required(),
    link: Joi.string().max(200).required(),
    description: Joi.string().max(200).required()
})

const announcementValidation = (req, res, next) => {
    try {
        const { value, error } = annoValidation.validate(req.body)
        
        if (error) throw new ClientError(400, error)
    
        let { imgUrl, personImgUrl } = req.files
        if( !(['image/jpg', 'image/jpeg', 'image/png'].includes(imgUrl.mimetype)) || !(['image/jpg', 'image/jpeg', 'image/png'].includes(personImgUrl.mimetype)) ) {
            throw new Error('Image mimetype must be jgp or png!')
        }
        
        let { link } = req.body
        if( !(link.startsWith('https://')) ) throw new ClientError(400,'This link is not secure!')
        
        return next()
    } catch(error) {
        return next(error)
    }
}


module.exports = {
    announcementValidation
}
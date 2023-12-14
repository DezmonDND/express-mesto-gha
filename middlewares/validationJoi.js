const { celebrate, Joi } = require('celebrate');
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports.createUserValidation = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().regex(regex)
    })
})

module.exports.userDataValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30)
    })
})

module.exports.getOneUserValidation = celebrate({
    params: Joi.object().keys({
        userId: Joi.string().required().length(24)
    })
})

module.exports.updateAvatarValidation = celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().required().regex(regex)
    })
})

module.exports.loginValidation = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
})

module.exports.createCardValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().regex(regex)
    })
})

module.exports.deleteCardValidation = celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required().length(24)
    })
})
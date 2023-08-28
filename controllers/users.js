const User = require('../models/user');

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
}

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
}

module.exports.getOneUser = (req, res) => {
    User.findById(req.user._id)
        .then(user => res.send({ data: user }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
}

module.exports.updateAvatar = (req, res) => {
    User.findByIdAndUpdate(req.user._id, { avatar: req.avatar })
        .then(user => res.send({ data: user }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
}

module.exports.updateUsersData = (req, res) => {
    User.findByIdAndUpdate(req.user._id, { name: req.name, about: req.about })
        .then(user => res.send({ data: user }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
}
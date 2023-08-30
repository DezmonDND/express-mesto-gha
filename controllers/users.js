const User = require('../models/user');



module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then(user => res.status(200).send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: '400 — Переданы некорректные данные при создании карточки.' });
            }
            return res.status(500).send({ message: '500 — На сервере произошла ошибка.' });
        });
}

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch(() => { res.status(500).send({ message: '500 — На сервере произошла ошибка.' }) });
}

module.exports.getOneUser = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (user === null) {
                return res.status(404).send({ message: '404 — Пользователь по указанному _id не найден.' })
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send({ message: '400 — Переданы некорректные данные.' });
            }
            return res.status(500).send({ message: '500 — На сервере произошла ошибка.' });
        });
}

module.exports.updateUsersData = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        {
            new: true,
            runValidators: true
        }
    )
        .then((user) => {
            if (user === null) {
                return res.status(404).send({ message: '404 — Пользователь по указанному _id не найден.' })
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: '400 — Переданы некорректные данные.' });
            }
            return res.status(500).send({ message: '500 — На сервере произошла ошибка.' });
        });
}
module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        {
            new: true,
            runValidators: true
        }
    )
        .then((user) => {
            if (user === null) {
                return res.status(404).send({ message: '404 — Пользователь по указанному _id не найден.' })
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: '400 — Переданы некорректные данные.' });
            }
            return res.status(500).send({ message: '500 — На сервере произошла ошибка.' });
        });
}

const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.createUser = (req, res) => {
    const { name, about, avatar, email, password } = req.body;

    bcrypt.hash(password, 10)
        .then(hash => User.create({ name, about, avatar, email, password: hash }))
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

module.exports.login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, 'some-secret-key', { expiresIn: '7d' })
            res.send({ token });
        })
        .catch((err) => {
            res.status(401).send({ message: err.message });
        })
}
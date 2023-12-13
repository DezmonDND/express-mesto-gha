const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');

module.exports.createUser = (req, res, next) => {
    const { name, about, avatar, email, password } = req.body;

    bcrypt.hash(password, 10)
        .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash
        }))
        .then((user) => res.status(200).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id
        }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при создании пользователя.'))
            } if (err.code === 11000) {
                next(new AlreadyExistsError('Пользователь уже существует'))
            }
            next(err)
        });
};

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch((err) => {
            next(err)
        });
}

module.exports.getUsersMe = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            if (!user) {
                next(new NotFoundError('Пользователь по указанному _id не найден.'))
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            next(err)
        });
}

module.exports.getOneUser = (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (!user) {
                next(new NotFoundError('Пользователь по указанному _id не найден.'))
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'))
            }
            next(err);
        });
}

module.exports.updateUsersData = (req, res, next) => {
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
            if (!user) {
                next(new NotFoundError('Пользователь по указанному _id не найден.'))
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при обновлении данных пользователя.'))
            }
            next(err);
        });
}
module.exports.updateAvatar = (req, res, next) => {
    const { avatar } = req.body;
    return User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        {
            new: true,
            runValidators: true
        }
    )
        .then((user) => {
            if (!user) {
                next(new NotFoundError('Пользователь по указанному _id не найден.'))
            }
            return res.status(200).send({ data: user })
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя.'))
            }
            next(err);
        });
}

module.exports.login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' })
            res.send({ token });
        })
        .catch((err) => {
            res.status(401).send({ message: err.message });
        })
}
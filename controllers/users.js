const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { default: mongoose } = require('mongoose');

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
            if (err instanceof mongoose.Error.ValidationError) {
                next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
            } else if (err.code === 11000) {
                next(new AlreadyExistsError('Пользователь уже существует'));
            } else {
                next(err);
            }
        });
};

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch((err) => {
            return next(err);
        });
}

const findUserById = (req, res, userData, next) => {
    User.findById(userData)
        .then((user) => {
            if (!user) {
                next(new NotFoundError('Пользователь по указанному _id не найден.'));
            } else {
                res.status(200).send({ data: user });
            }
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.CastError) {
                next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
            } else {
                next(err);
            }
        });
};

module.exports.getUsersMe = (req, res, next) => {
    const userData = req.user._id;
    // User.findById(req.user._id)
    //     .then((user) => {
    //         if (!user) {
    //             next(new NotFoundError('Пользователь по указанному _id не найден.'));
    //         } else {
    //             res.status(200).send({ data: user });
    //         }
    //     })
    findUserById(req, res, userData, next);
        // .catch((err) => {
        //     return next(err);
        // });
}

module.exports.getOneUser = (req, res, next) => {
    const userData = req.params.userId;
    // User.findById(req.params.userId)
    //     .then((user) => {
    //         if (!user) {
    //             next(new NotFoundError('Пользователь по указанному _id не найден.'));
    //         } else {
    //             res.status(200).send({ data: user });
    //         }
    //     })
    findUserById(req, res, userData, next);
        // .catch((err) => {
        //     if (err instanceof mongoose.Error.CastError) {
        //         next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
        //     } else {
        //         next(err);
        //     }
        // });
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
            } else {
                res.status(200).send({ data: user });
            }
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                next(new BadRequestError('Переданы некорректные данные при обновлении данных пользователя.'))
            } else {
                next(err);
            }
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
            } else {
                res.status(200).send({ data: user });
            }
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя.'))
            } else {
                next(err);
            }
        });
}

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' })
            res.send({ token });
        })
        .catch((err) => {
            return next(new UnauthorizedError('Не удалось авторизоавться.'));
        })
}
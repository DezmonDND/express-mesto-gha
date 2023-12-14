const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
    Card.find({})
        .then((cards) => res.send({ data: cards }))
        .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user._id })
        .then((card) => res.status(201).send({ data: card }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
            } else {
                next(err);
            }
        });
};

module.exports.deleteCard = (req, res, next) => {
    const { cardId } = req.params;
    const { _id: userId } = req.user;

    Card.findById(cardId)
        .then((card) => {
            if (!card) {
                next(new NotFoundError('Передан несуществующий _id карточки.'));
            }
            if (userId !== card.owner.toString()) {
                next(new ForbiddenError('Невозможно удалить карточку.'));
            }
            return Card.deleteOne()
                .then(() => res.status(200).send({ message: 'Карточка удалена' }));
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
            } else {
                next(err);
            }
        });
};

module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        {
            new: true,
        },
    )
        .then((card) => {
            if (!card) {
                next(new NotFoundError('Передан несуществующий _id карточки.'));
            } else {
                res.status(200).send({ data: card });
            }
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
            } else {
                next(err);
            }
        });
};

module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        {
            new: true,
        },
    )
        .then((card) => {
            if (card) {
                res.send({ data: card });
            } else {
                next(new NotFoundError('Передан несуществующий _id карточки.'));
            }
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
            } else {
                next(err);
            }
        });
};

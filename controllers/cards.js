const Card = require('../models/card');

module.exports.createCard = (req, res) => {
    const { name, link, cardId } = req.body;

    Card.create({ name, link, owner: cardId })
        .then(card => card.send({ data: card }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
};

module.exports.getCards = (req, res) => {
    Card.find({})
        .populate('user')
        .then(cards => res.send({ data: cards }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
};

module.exports.deleteCard = (req, res) => {
    Card.findByIdAndRemove(req.params.cardId)
        .then(card => res.send({ data: card }))
        .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }) });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
);

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
);
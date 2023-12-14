const cardsRouter = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { createCardValidation, deleteCardValidation } = require('../middlewares/validationJoi');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.delete('/:cardId', deleteCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', deleteCardValidation, likeCard);
cardsRouter.delete('/:cardId/likes', deleteCardValidation, dislikeCard);

module.exports = cardsRouter;

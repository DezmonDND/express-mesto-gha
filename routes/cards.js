const router = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { createCardValidation, deleteCardValidation } = require('../middlewares/validationJoi');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', deleteCardValidation, deleteCard);
router.put('/:cardId/likes', deleteCardValidation, likeCard);
router.delete('/:cardId/likes', deleteCardValidation, dislikeCard);

module.exports = router;

const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // создает карточку
router.delete('/:cardId', deleteCard); // удаляет карточку по ID
router.put('/:cardId/likes', likeCard); // поставить лайк на карточку
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;

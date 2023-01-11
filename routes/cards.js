const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCard, validateCreateCard } = require('../middlewares/validation');

router.get('/', getCards); // возвращает все карточки
router.post('/', validateCreateCard, createCard); // создает карточку
router.delete('/:cardId', validateCard, deleteCard); // удаляет карточку по ID
router.put('/:cardId/likes', validateCard, likeCard); // поставить лайк на карточку
router.delete('/:cardId/likes', validateCard, dislikeCard);

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCard } = require('../middlewares/validation');

router.get('/', getCards); // возвращает все карточки
// router.post('/', validateCreateCard, createCard); // создает карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Неверный формат ссылки на изображение');
    }),
  }),
}), createCard);

router.delete('/:cardId', validateCard, deleteCard); // удаляет карточку по ID
router.put('/:cardId/likes', validateCard, likeCard); // поставить лайк на карточку
router.delete('/:cardId/likes', validateCard, dislikeCard);

module.exports = router;

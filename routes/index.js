const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const cardRouter = require('./cards');
const userRouter = require('./users');
const {
  ERROR_NOT_FOUND,
} = require('../errors/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Неверный формат ссылки на изображение');
    }),
    email: Joi.string().custom((value, helpers) => {
      if (validator.isEmail(value)) return value;
      return helpers.message('Неверный формат почты');
    }),
    password: Joi.string().required().min(4).max(36),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Неверный формат ссылки на изображение');
    }),
    email: Joi.string().custom((value, helpers) => {
      if (validator.isEmail(value)) return value;
      return helpers.message('Неверный формат почты');
    }),
    password: Joi.string().required().min(4).max(36),
  }),
}), login);

// router.post('/signup', createUser);
// router.post('/signin', login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Указан неправильный путь' }));

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
// const { validateSignup, validateSignin, validateAuth } = require('../middlewares/validation');
const cardRouter = require('./cards');
const userRouter = require('./users');
const {
  ERROR_NOT_FOUND,
} = require('../errors/constants');

const checkLink = Joi.string()
  .custom((value, helpers) => {
    if (validator.isURL(value)) return value;
    return helpers.message('Неверный формат ссылки на изображение');
  });

// вспомогательная ф-ия проверки email
const checkEmail = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isEmail(value)) return value;
    return helpers.message('Неверный формат почты');
  });

// router.post('/signup', validateSignup, createUser);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkLink),
    // email: Joi.string().required().min(2).max(30),
    email: Joi.string().custom(checkEmail),
    password: Joi.string().required().min(4).max(36),
  }),
}), createUser);

// router.post('/signin', validateSignin, login);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkLink),
    // email: Joi.string().required().min(2).max(30),
    email: Joi.string().custom(checkEmail),
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

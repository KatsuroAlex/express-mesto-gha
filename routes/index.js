const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
// const { validateSignup, validateSignin, validateAuth } = require('../middlewares/validation');
const cardRouter = require('./cards');
const userRouter = require('./users');
const {
  ERROR_NOT_FOUND,
} = require('../errors/constants');

// router.post('/signup', validateSignup, createUser);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// router.post('/signin', validateSignin, login);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

// router.post('/signup', createUser);
// router.post('/signin', login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Указан неправильный путь' }));

module.exports = router;

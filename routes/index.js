const router = require('express').Router();
const {
  ERROR_NOT_FOUND,
} = require('../errors/constants');

const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Указан неправильный путь' }));

module.exports = router;

const router = require('express').Router();

const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;

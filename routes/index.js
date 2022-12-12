const router = require('express').Router();

router.use((req, res, next) => {
  req.user = { _id: '638a18e5564e527e4b5bd599' }; // вставьте сюда _id созданного в предыдущем пункте пользователя
  next();
});

const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => res.status(404).send({ message: 'Указан неправильный путь' }));

module.exports = router;

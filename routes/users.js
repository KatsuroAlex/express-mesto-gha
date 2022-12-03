const router = require('express').Router();

const { createUser, getUsers, getUser } = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей
router.post('/', createUser); // создает пользователя
router.get('/:id', getUser); // возвращает пользователя по ID

module.exports = router;

const router = require('express').Router();

const {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей
router.post('/', createUser); // создает пользователя
router.get('/:id', getUser); // возвращает пользователя по ID
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

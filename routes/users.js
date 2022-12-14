const router = require('express').Router();

const {
  getUsers, getUser, updateUser, updateAvatar, findUser,
} = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей
// router.post('/', createUser); // создает пользователя
router.get('/:id', getUser); // возвращает пользователя по ID
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/me', findUser); // найти пользователя

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateUser, updateAvatar, findUser,
} = require('../controllers/users');
const { validateUserProfile, validateUserAvatar } = require('../middlewares/validation');

router.get('/', getUsers); // возвращает всех пользователей
// router.post('/', createUser); // создает пользователя
// router.get('/:id', validateUser, getUser); // возвращает пользователя по ID
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser); // возвращает пользователя по ID

router.patch('/me', validateUserProfile, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);
router.get('/me', findUser); // найти пользователя

module.exports = router;

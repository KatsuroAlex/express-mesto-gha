const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUser, validateUserProfile, validateUserAvatar } = require('../middlewares/validation');

const {
  getUsers, getUser, updateUser, updateAvatar, findUser,
} = require('../controllers/users');

// const validateUser = celebrate({
//   params: Joi.object().keys({
//     userId: checkedId,
//   }),
// });

// const validateUserProfile = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//   }),
// });

// const validateUserAvatar = celebrate({
//   body: Joi.object().keys({
//     avatar: checkedLink,
//   }),
// });

router.get('/', getUsers); // возвращает всех пользователей

router.get('/:id', validateUser, getUser); // возвращает пользователя по ID
// router.get('/:id', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().alphanum().required().length(24),
//   }),
// }), getUser);

router.patch('/me', validateUserProfile, updateUser);
// router.get('/me', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//   }),
// }), updateUser);

router.patch('/me/avatar', validateUserAvatar, updateAvatar);
// router.patch('/me/avatar', celebrate({
//   body: Joi.string().custom((value, helpers) => {
//     if (validator.isURL(value)) return value;
//     return helpers.message('Неверный формат ссылки на изображение');
//   }),
// }), updateAvatar);

router.get('/me', findUser); // найти пользователя

module.exports = router;

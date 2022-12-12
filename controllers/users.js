const User = require('../models/user');

const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS,
  USER_CREATED,
} = require('./constants');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(USER_CREATED).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.log(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    console.error(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).json({ users });
  } catch (e) {
    console.log(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Достаем id через деструктуризацию
    const user = await User.findById(id);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(SUCCESS).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные id пользователя' });
    }
    console.log(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const result = await User.findByIdAndUpdate(req.user._id, updates, options);
    console.log(req.user);
    if (result === null) {
      return res.status(ERROR_VALIDATION).json({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(SUCCESS).json(result);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (e.name === 'CastError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные id пользователя' });
    }
    console.log(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const options = { new: true };
    const user = await User.findByIdAndUpdate(req.user, req.body, options);
    if (user === null) {
      return res.status(ERROR_VALIDATION).json({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(SUCCESS).json({ user });
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    console.log(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
};

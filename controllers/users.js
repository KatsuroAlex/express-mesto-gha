const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.log(e);
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    if (e.name === 'CastError' || e.name === 'TypeError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    console.error(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Достаем id через деструктуризацию
    const user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные id пользователя' });
    }
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const result = await User.findByIdAndUpdate(req.user._id, updates, options);
    console.log(req.user);
    if (result === null) {
      return res.status(400).json({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(200).json(result);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (e.name === 'CastError' || e.name === 'TypeError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные id пользователя' });
    }
    console.log(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const options = { new: true };
    const user = await User.findByIdAndUpdate(req.user, req.body, options);
    if (user === null) {
      return res.status(400).json({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(200).json({ user });
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    console.log(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
};

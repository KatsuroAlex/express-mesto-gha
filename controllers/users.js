const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Достаем id через деструктуризацию
    const user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};

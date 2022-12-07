const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

// const createUser = async (req, res) => {
//   try {
//     const { name, about, avatar } = req.body;
//     const user = await User.create(req.body);
//     return res.status(201).json({ user });
//   } catch (e) {
//     console.log(e);
//     return res.status(400).json({ message: 'Произошла ошибка' });
//   }
// };

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
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
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

// const updateUser = (req, res) => {
//   User.findByIdAndUpdate(req.user, req.body, { new: true })
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       return res.status(500).json({ message: 'Произошла ошибка' });
//     });
// };

const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(req.user._id, updates, options);
    console.log(req.user);
    if (result === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const options = { new: true };
    const user = await User.findByIdAndUpdate(req.user, req.body, options);
    return res.status(201).json({ user });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
};

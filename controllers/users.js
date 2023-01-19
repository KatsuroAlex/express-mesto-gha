const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UserExistError = require('../errors/userExistError');

const {
  SUCCESS,
} = require('../errors/constants');

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!password || password.length < 4) {
    throw new ValidationError('Пароль отсутствует или короче четырех символов');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new UserExistError('Пользователь c таким email уже существует'));
  }

  // хешируем пароль
  const hash = await bcrypt.hash(password, 10);
  return User.create({
    name,
    about,
    avatar,
    email: req.body.email,
    password: hash,
  })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new UserExistError('Пользователь c таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign(
//         { _id: user._id },
//         NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
//         { expiresIn: '7d' },
//       );
//       res
//         .cookie('token', token, {
//           maxAge: 3600000 * 24 * 7,
//           httpOnly: true,
//         })
//         .send({ token });
//     })
//     .catch(next);
// };

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' },
    );
    res
      .cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ token });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).json({ users });
  } catch (err) {
    return next(err);
  }
};

// const findUser = (req, res, next) => {
//   User.findById(req.user._id)
//     .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
//     .then((user) => res.send(user))
//     .catch(next);
// };

const findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(new NotFoundError('Пользователь по указанному _id не найден'));
    return res.send({ user });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Достаем id через деструктуризацию
    const user = await User.findById(id).orFail(new NotFoundError('Пользователь по указанному id не найден'));
    return res.status(SUCCESS).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotFoundError('Переданы некорректные данные id пользователя'));
    } else {
      next(err);
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const result = await User.findByIdAndUpdate(req.user._id, updates, options).orFail(new NotFoundError('Пользователь по указанному _id не найден'));
    return res.status(SUCCESS).json(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const options = { new: true };
    const user = await User.findByIdAndUpdate(req.user, req.body, options).orFail(new NotFoundError('Пользователь по указанному _id не найден'));
    return res.status(SUCCESS).json({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      return next(err);
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
  login,
  findUser,
};

const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UserExistError = require('../errors/userExistError');

const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS,
  USER_CREATED,
  ERROR_USER_EXIST,
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
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     console.log(err);
    //     return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные ' });
    //   }
    //   if (err.name === 'MongoError' && err.code === 11000) {
    //     console.log(err);
    //     return res.status(ERROR_USER_EXIST).send({ message: 'Пользователь c таким email уже существует' });
    //   }

    //   console.error(err);
    //   return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
    // });
    });
};

//     bcrypt.hash(password, 10)
//       try {
//         ((hash) => User.create({
//           name,
//           about,
//           avatar,
//           email: req.body.email,
//           password: hash,
//         }))
//         } catch (err) {
//           throw new ValidationError('Пароль отсутствует или короче четырех символов');
//         }

//     return res.status(USER_CREATED).json(user);
//   } catch (e) {
//     if (e.name === 'ValidationError') {
//       console.log(e);
//       return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные ' });
//     }
//     console.error(e);
//     return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
//   }
// };

// const createUser = (req, res, next) => {
//   const {
//     name,
//     about,
//     avatar,
//     email,
//     password,
//   } = req.body;

//   if (!password || password.length < 4) {
//     throw new ValidationError('Пароль отсутствует или короче четырех символов');
//   }

//   // хешируем пароль
//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       name,
//       about,
//       avatar,
//       email: req.body.email,
//       password: hash,
//     }))
//     .then((user) => res.json(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         console.log(err);
//         res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
//       } else if (err.name === 'MongoError' && err.code === 11000) {
//         next(new UserExistError('Пользователь с таким email уже существует'));
//       } else {
//         next(err);
//       }
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        // 'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
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

const findUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch(next);
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
  login,
  findUser,
};

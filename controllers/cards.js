const Card = require('../models/card');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER_FAIL,
  SUCCESS,
  USER_CREATED,
} = require('./constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(SUCCESS).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(ERROR_VALIDATION).json({ message: 'Произошла ошибка' });
  }
};

// const createCard = async (req, res) => {
//   try {
//     console.log(req.user);
//     const { name, link } = req.body;
//     const card = await Card.create({ name, link, owner: req.user });

//     return res.status(201).json({ card });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ message: 'Произошла ошибка' });
//   }
// };

// const createCard = (req, res) => {
//   const { name, link } = req.body;
//   Card
//     .create({ name, link, owner: req.user })
//     .then((card) => res.send(card))
//     .catch((e) => {
//       console.error(e);
//       return res.status(500).json({ message: 'Произошла ошибка' });
//     });
// };

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    console.log(req.user._id); // _id станет доступен
    return res.status(USER_CREATED).json(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findById(id);
    if (String(card.owner) === String(req.user._id)) {
      card.remove();
      return res.send({ message: 'Пост удален' });
    }
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Card not found' });
    }
    return res.send({ message: 'Карточка с указанным id не найдена' });
  } catch (e) {
    console.error(e);
    return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
  }
};

// const deleteCard = (req, res) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (String(card.owner) === String(req.user._id)) {
//         card.remove();
//         return res.send({ message: 'Пост удален' });
//       }
//       res.send({ message: 'Карточка с указанным id не найдена' });
//     })
//     .catch((e) => {
//       console.error(e);
//       return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
//     });
// };

const likeCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные id карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'SomeError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные id карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
  }
};

// const dislikeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => res.send(card))
//     .catch((e) => {
//       if (e.name === 'ValidationError' || e.name === 'SomeError') {
//         console.error(e);
//         return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
//       }
//       if (e.name === 'CastError') {
//         return res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные id карточки' });
//       }
//       console.error(e);
//       return res.status(ERROR_SERVER_FAIL).json({ message: 'Произошла ошибка' });
//     });
// };

module.exports = {
  getCards, // GET /cards — возвращает все карточки
  createCard, // POST /cards — создаёт карточку
  deleteCard, // DELETE /cards/:cardId — удаляет карточку по id
  likeCard, // PUT /cards/:cardId/likes — поставить лайк карточке
  dislikeCard, // DELETE /cards/:cardId/likes — убрать лайк с карточки
};

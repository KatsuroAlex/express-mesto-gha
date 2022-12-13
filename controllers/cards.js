const Card = require('../models/card');

const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS,
} = require('./constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).send(cards);
  } catch (e) {
    console.error(e);
    return res.status(ERROR_VALIDATION).json({ message: 'Переданы некорректные данные при создании карточки' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    console.log(req.user._id); // _id станет доступен
    return res.status(SUCCESS).json(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findById(id);
    return card.remove();
    // return res.send({ message: 'Пост удален' });
  } catch (e) {
    if (e.name === 'CastError') {
      console.error(e);
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные id карточки' });
    }
    // if (e.name === 'SomeError') {
    //   console.error(e);
    //   return res.status(ERROR_VALIDATION).send({ message: 'Переи создании карточки' });
    // }

    console.error(e);
    return res.status(ERROR_NOT_FOUND).json({ message: 'Некорректный id карточки' });
  }
};

const likeCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка с указанным id не найдена' });
    }
    return res.send(card);
  } catch (e) {
    // if (e.name === 'SomeError') {
    //   console.error(e);
    //   return res.status(ERROR_VALIDATION).send({ message: 'Переданы некоррйка' });
    // }
    if (e.name === 'CastError') {
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные id карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка с указанным id не найдена' });
    }
    return res.send(card);
  } catch (e) {
    // if (e.name === 'ValidationError' || e.name === 'SomeError') {
    //   console.error(e);
    //   return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорка' });
    // }
    if (e.name === 'CastError') {
      return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные id карточки' });
    }
    console.error(e);
    return res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getCards, // GET /cards — возвращает все карточки
  createCard, // POST /cards — создаёт карточку
  deleteCard, // DELETE /cards/:cardId — удаляет карточку по id
  likeCard, // PUT /cards/:cardId/likes — поставить лайк карточке
  dislikeCard, // DELETE /cards/:cardId/likes — убрать лайк с карточки
};

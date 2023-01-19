const Card = require('../models/card');
const ValidationError = require('../errors/validationError');
const NoRightsError = require('../errors/noRightsError');
const NotFoundError = require('../errors/notFoundError');

const {
  SUCCESS,
} = require('../errors/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      return next(err);
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    if (String(card.owner) !== String(req.user._id)) {
      throw new NoRightsError('Недостаточно прав для удаления');
    }
    card.remove();
    res.send({ message: 'Пост удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные id карточки'));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']).orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные id карточки'));
    } else {
      return next(err);
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']).orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные id карточки'));
    } else {
      return next(err);
    }
    return next(err);
  }
};

module.exports = {
  getCards, // GET /cards — возвращает все карточки
  createCard, // POST /cards — создаёт карточку
  deleteCard, // DELETE /cards/:cardId — удаляет карточку по id
  likeCard, // PUT /cards/:cardId/likes — поставить лайк карточке
  dislikeCard, // DELETE /cards/:cardId/likes — убрать лайк с карточки
};

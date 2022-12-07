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
    if (err.name === 'SomeErrorName') return res.status(ERROR_CODE).send(...);
    return res.status(200).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
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
    const {name, link} = req.body;
    const card = await Card.create({name, link, owner: req.user._id});
    console.log(req.user._id); // _id станет доступен
    return res.status(201).json(card);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Произошла ошибка' });
  }
};

// const deleteCard = async (req, res) => {
//   try {
//     const { cardId } = req.params; // Достаем id через деструктуризацию
//     const card = await Card.findById({ cardId });
//     if (card === null) {
//       return res.status(404).json({ message: 'Card not found' });
//     }
//     card.remove();
//     res.send({ message: 'Пост удален' });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ message: 'Произошла ошибка' });
//   }
// };

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (String(card.owner) === String(req.user._id)) {
        card.remove();
        res.send({ message: 'Пост удален' });
      }
      res.send({ message: 'Недостаточно прав для удаления карточки' });
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).json({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((e) => {
      console.log(e);
      return res.status(400).json({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((e) => {
      console.log(e);
      return res.status(400).json({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards, // GET /cards — возвращает все карточки
  createCard, // POST /cards — создаёт карточку
  deleteCard, // DELETE /cards/:cardId — удаляет карточку по id
  likeCard, // PUT /cards/:cardId/likes — поставить лайк карточке
  dislikeCard, // DELETE /cards/:cardId/likes — убрать лайк с карточки
};

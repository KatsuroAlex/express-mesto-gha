// // const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// // const router = require('./routes');

// const PORT = 3000;

const { PORT = 3000 } = process.env;
const app = express();

// // подключаем мидлвары, роуты и тд
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = { _id: '638a18e5564e527e4b5bd599' }; // вставьте сюда _id созданного в предыдущем пункте пользователя
  next();
});

/// основные роуты
app.use('*', (req, res) => res.status(404).send({ message: 'Указан неправильный путь' }));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// подключаемся к серверу mongo
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const router = require('./routes');

// const PORT = 3000;
// const { PORT = 3000, BASE_PATH } = process.env;
const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());

// подключаем мидлвары, роуты и тд
app.use((req, res, next) => {
  req.user = { _id: '638a18e5564e527e4b5bd599' }; // вставьте сюда _id созданного в предыдущем пункте пользователя
  next();
});

/// основные роуты
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  console.log(BASE_PATH);
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}, () => {
  console.log('Connected to MongoDB');
});

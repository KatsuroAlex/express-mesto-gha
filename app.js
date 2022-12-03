const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

// const PORT = 3000;
const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}, () => {
  console.log('Connected to MongoDB');
});

// подключаем мидлвары, роуты и всё остальное...

app.use(bodyParser.json());

/// основные роуты
app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = { _id: '638a18e5564e527e4b5bd599' }; // вставьте сюда _id созданного в предыдущем пункте пользователя
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  console.log(BASE_PATH);
});

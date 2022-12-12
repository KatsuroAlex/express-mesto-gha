const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// // подключаем мидлвары, роуты и тд
app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '638a18e5564e527e4b5bd599' };
  next();
});

/// основные роуты
app.use(router);

app.use('*', (req, res) => res.status(404).send({ message: 'Указан неправильный путь' }));

// подключаемся к серверу mongo
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
}, () => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const handleErrors = require('./middlewares/handleErrors');

const { PORT = 3000 } = process.env;
const app = express();

// // подключаем мидлвары, роуты и тд
app.use(express.json());
app.use(cookieParser());

/// основные роуты
app.use(router);

app.use(errors());

app.use(handleErrors);

// подключаемся к серверу mongo
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
}, () => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

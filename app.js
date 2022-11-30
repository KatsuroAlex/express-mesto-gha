const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//const bodyParser = require('body-parser');
const router = require('./routes');




const PORT = 3000;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...

app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.json());

app.use('/users', router);

app.listen(PORT, () => {
  console.log('App listening on port ${PORT}!');
});
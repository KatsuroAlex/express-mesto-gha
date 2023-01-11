const { ERROR_SERVER } = require('../errors/constants');

const handleErrors = (err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === ERROR_SERVER
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = handleErrors;

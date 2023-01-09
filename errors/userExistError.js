const { ERROR_USER_EXIST } = require('./constants');

class UserExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_USER_EXIST;
  }
}

module.exports = UserExistError;

const { ERROR_NO_RIGHTS } = require('./constants');

class NoRightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NO_RIGHTS;
  }
}

module.exports = NoRightsError;

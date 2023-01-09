const { ERROR_VALIDATION } = require('./constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_VALIDATION;
  }
}

module.exports = ValidationError;

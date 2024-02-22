const BaseError = require("./BaseError");

class BadRequestError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;

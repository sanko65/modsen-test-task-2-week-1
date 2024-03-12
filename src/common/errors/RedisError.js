const BaseError = require("./BaseError");

class RedisError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = RedisError;

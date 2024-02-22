class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 500;
  }
}

module.exports = BaseError;

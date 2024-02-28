const BaseError = require("./BaseError");

class DeleteLogoError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = DeleteLogoError;

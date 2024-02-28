const BaseError = require("./BaseError");

class UploadLogoError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = UploadLogoError;

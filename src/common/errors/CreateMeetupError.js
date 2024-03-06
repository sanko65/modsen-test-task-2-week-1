const BaseError = require("./BaseError");

class CreateMeetupError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = CreateMeetupError;

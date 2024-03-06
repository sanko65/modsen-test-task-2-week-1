const BaseError = require("./BaseError");

class DeleteMeetupError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = DeleteMeetupError;

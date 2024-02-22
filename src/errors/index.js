const BaseError = require("./BaseError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const ForbiddenError = require("./ForbiddenError");
const UnauthorizedError = require("./UnauthorizedError");

module.exports = {
  BaseError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
};

const BaseError = require("./BaseError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const ForbiddenError = require("./ForbiddenError");
const UnauthorizedError = require("./UnauthorizedError");
const UploadLogoError = require("./UploadLogoError");
const DeleteLogoError = require("./DeleteLogoError");

module.exports = {
  BaseError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  UploadLogoError,
  DeleteLogoError,
};

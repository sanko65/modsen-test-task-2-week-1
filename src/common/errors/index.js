const BaseError = require("./BaseError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const ForbiddenError = require("./ForbiddenError");
const UnauthorizedError = require("./UnauthorizedError");
const UploadLogoError = require("./UploadLogoError");
const DeleteLogoError = require("./DeleteLogoError");
const DeleteMeetupError = require("./DeleteMeetupError");
const CreateMeetupError = require("./CreateMeetupError");

module.exports = {
  BaseError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  UploadLogoError,
  DeleteLogoError,
  DeleteMeetupError,
  CreateMeetupError,
};

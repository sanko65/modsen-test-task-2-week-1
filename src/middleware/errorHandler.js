const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require("../errors/index");

module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Token expired");
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid token");
  }
  console.log(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
};

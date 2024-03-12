const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { BaseError } = require("../errors/index");
const logger = require("../../configs/winstonConfig");

module.exports = function errorHandler(err, req, res, next) {
  logger.info(
    `USER ERROR: Error occurred: ${err.constructor.name}, Status: ${err.statusCode}, Message: ${err.message}`
  );

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Token expired");
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Invalid token");
  }

  logger.info(
    `SERVER ERROR: Error occurred: ${err.constructor.name}, Status: ${StatusCodes.INTERNAL_SERVER_ERROR}, Message: ${err.message}`
  );

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
};

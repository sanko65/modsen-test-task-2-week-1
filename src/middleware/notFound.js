const { StatusCodes } = require("http-status-codes");

module.exports = function notFoundHandler(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({ message: "There is no such route" });
};

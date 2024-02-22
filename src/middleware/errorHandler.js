const { StatusCodes } = require("http-status-codes");

module.exports = function errorHandler(err, req, res, next) {
  console.log(err.stack);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
};

const { NotFoundError } = require("../errors/index");

module.exports = function notFoundHandler(req, res, next) {
  throw new NotFoundError("There is no such route");
};

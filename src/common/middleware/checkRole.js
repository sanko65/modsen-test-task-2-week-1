const { ForbiddenError } = require("../errors/index");

module.exports = function checkRole(req, res, next) {
  if (req.user.role !== "moderator") {
    throw new ForbiddenError(
      "You are not a moderator. You can only attend to meetups."
    );
  }
  next();
};

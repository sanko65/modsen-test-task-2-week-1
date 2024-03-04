const { ForbiddenError } = require("../errors/index");

module.exports = function checkRole(allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("You are not allowed to perform this action");
    }
    next();
  };
};

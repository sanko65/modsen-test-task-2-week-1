const { StatusCodes } = require("http-status-codes");

module.exports = function checkRole(req, res, next) {
  if (req.user.role !== "moderator") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json("You can only attend to meetups");
  }
  next();
};

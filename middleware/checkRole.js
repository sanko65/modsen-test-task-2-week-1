module.exports = function checkRole(req, res, next) {
  if (req.user.role !== "moderator") {
    return res.status(403).json("You can only attend to meetups");
  }
  next();
};

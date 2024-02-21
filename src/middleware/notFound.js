module.exports = function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "There is no such route" });
};

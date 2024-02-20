module.exports = function requestWrap(controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = function validation(schema, source) {
  return function (req, res, next) {
    const { error, value } = schema.validate(req[source]);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    req.validatedData = value;
    next();
  };
};

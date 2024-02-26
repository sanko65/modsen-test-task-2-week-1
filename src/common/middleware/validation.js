const { BadRequestError } = require("../errors/index");

module.exports = function validation(schema, source) {
  return function (req, res, next) {
    const { error, value } = schema.validate(req[source]);

    if (error) {
      throw new BadRequestError("Invalid data provided");
    }

    req.validatedData = value;
    next();
  };
};

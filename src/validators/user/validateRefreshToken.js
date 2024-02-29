const Joi = require("joi");

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(true);

module.exports = refreshTokenSchema;

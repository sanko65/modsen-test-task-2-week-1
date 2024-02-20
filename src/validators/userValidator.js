const Joi = require("joi");

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const takeUserInfoSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "moderator").required(),
});

module.exports = {
  refreshTokenSchema,
  takeUserInfoSchema,
};

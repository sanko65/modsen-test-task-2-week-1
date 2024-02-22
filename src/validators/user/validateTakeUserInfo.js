const Joi = require("joi");

const takeUserInfoSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "moderator").required(),
});

module.exports = takeUserInfoSchema;

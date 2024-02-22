const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "moderator").required(),
  password: Joi.string().min(6).max(20).required(),
});

module.exports = signupSchema;

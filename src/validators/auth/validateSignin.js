const Joi = require("joi");

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

module.exports = signinSchema;

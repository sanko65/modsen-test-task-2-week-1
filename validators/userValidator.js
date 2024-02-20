const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "moderator").required(),
  password: Joi.string().min(6).max(20).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const takeUserInfoSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "moderator").required(),
});

module.exports = {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
  takeUserInfoSchema,
};

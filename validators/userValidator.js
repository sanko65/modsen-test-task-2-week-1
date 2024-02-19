const Joi = require("joi");

const validateSignup = (userInfo) => {
  const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "moderator").required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return signupSchema.validate(userInfo);
};

const validateSignin = (userInfo) => {
  const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });
  return signinSchema.validate(userInfo);
};

const validateRefreshToken = (userInfo) => {
  const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  return refreshTokenSchema.validate(userInfo);
};

const validateTakeUserInfo = (userInfo) => {
  const takeUserInfoSchema = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "moderator").required(),
  });
  return takeUserInfoSchema.validate(userInfo);
};

module.exports = {
  validateSignup,
  validateSignin,
  validateRefreshToken,
  validateTakeUserInfo,
};

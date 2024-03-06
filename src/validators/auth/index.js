const signupSchema = require("./validateSignup");
const signinSchema = require("./validateSignin");
const refreshTokenSchema = require("./validateRefreshToken");

module.exports = {
  signinSchema,
  signupSchema,
  refreshTokenSchema,
};

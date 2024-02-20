const Router = require("express");
const passport = require("passport");
const validation = require("../middleware/validation");
const validatorSchemas = require("../validators/userValidator");
const userController = require("../controllers/userController");

const router = new Router();

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  validation(validatorSchemas.takeUserInfoSchema, "user"),
  userController.takeUserInfo
);
router.post(
  "/signup",
  validation(validatorSchemas.signupSchema, "body"),
  userController.signup
);
router.post(
  "/signin",
  validation(validatorSchemas.signinSchema, "body"),
  userController.signin
);
router.post(
  "/refreshtoken",
  validation(validatorSchemas.refreshTokenSchema, "body"),
  userController.refreshToken
);

module.exports = router;

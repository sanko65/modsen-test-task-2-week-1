const Router = require("express");
const passport = require("passport");
const validation = require("../middleware/validation");
const validatorSchemas = require("../validators/userValidator");
const userController = require("../controllers/userController");
const requestWrap = require("../middleware/requestWrap");

const router = new Router();

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  validation(validatorSchemas.takeUserInfoSchema, "user"),
  requestWrap(userController.takeUserInfo)
);
router.post(
  "/signup",
  validation(validatorSchemas.signupSchema, "body"),
  requestWrap(userController.signup)
);
router.post(
  "/signin",
  validation(validatorSchemas.signinSchema, "body"),
  requestWrap(userController.signin)
);
router.post(
  "/refreshtoken",
  validation(validatorSchemas.refreshTokenSchema, "body"),
  requestWrap(userController.refreshToken)
);

module.exports = router;

const Router = require("express");
const validation = require("../common/middleware/validation");
const passport = require("passport");
const authController = require("../controllers/authController");
const requestWrap = require("../common/middleware/requestWrap");
const {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
} = require("../validators/auth/index");

const router = new Router();

router.post(
  "/signup",
  validation(signupSchema, "body"),
  requestWrap(authController.signup)
);
router.post(
  "/signin",
  validation(signinSchema, "body"),
  requestWrap(authController.signin)
);
router.get(
  "/refreshtoken",
  validation(refreshTokenSchema, "cookies"),
  requestWrap(authController.refreshToken)
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  requestWrap(authController.googleAuth)
);

module.exports = router;

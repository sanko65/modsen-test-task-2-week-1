const Router = require("express");
const validation = require("../middleware/validation");
const authController = require("../controllers/authController");
const requestWrap = require("../middleware/requestWrap");
const { signupSchema, signinSchema } = require("../validators/auth/index");

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

module.exports = router;

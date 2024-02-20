const Router = require("express");
const validation = require("../middleware/validation");
const validatorSchemas = require("../validators/authValidator");
const authController = require("../controllers/authController");
const requestWrap = require("../middleware/requestWrap");

const router = new Router();

router.post(
  "/signup",
  validation(validatorSchemas.signupSchema, "body"),
  requestWrap(authController.signup)
);
router.post(
  "/signin",
  validation(validatorSchemas.signinSchema, "body"),
  requestWrap(authController.signin)
);

module.exports = router;

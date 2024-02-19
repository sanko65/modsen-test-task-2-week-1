const Router = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");

const router = new Router();

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  userController.takeUserInfo
);
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/refreshtoken", userController.refreshToken);

module.exports = router;

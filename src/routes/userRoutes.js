const Router = require("express");
const passport = require("passport");
const validation = require("../common/middleware/validation");
const upload = require("../common/middleware/multer");
const userController = require("../controllers/userController");
const requestWrap = require("../common/middleware/requestWrap");
const {
  takeUserInfoSchema,
  refreshTokenSchema,
} = require("../validators/user/index");

const router = new Router();

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  validation(takeUserInfoSchema, "user"),
  requestWrap(userController.takeUserInfo)
);
router.post(
  "/refreshtoken",
  validation(refreshTokenSchema, "body"),
  requestWrap(userController.refreshToken)
);
router.post(
  "/uploadlogo",
  passport.authenticate("jwt", { session: false }),
  validation(takeUserInfoSchema, "user"),
  upload.single("picture"),
  requestWrap(userController.uploadLogo)
);
router.delete(
  "/deletelogo",
  passport.authenticate("jwt", { session: false }),
  validation(takeUserInfoSchema, "user"),
  requestWrap(userController.deleteLogo)
);

module.exports = router;

const Router = require("express");
const passport = require("passport");
const router = new Router();
const validatorSchemas = require("../validators/meetupValidator");
const validation = require("../middleware/validation");
const meetupController = require("../controllers/meetupController");
const checkRole = require("../middleware/checkRole");

router.get(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  meetupController.getMeetups
);
router.get(
  "/meetups/:id",
  passport.authenticate("jwt", { session: false }),
  validation(validatorSchemas.meetupIdSchema, "params"),
  meetupController.getMeetupsById
);
router.post(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  validation(validatorSchemas.createMeetupSchema, "body"),
  meetupController.createMeetup
);
router.put(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  validation(validatorSchemas.updateMeetupSchema, "body"),
  meetupController.updateMeetup
);
router.delete(
  "/meetups/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  validation(validatorSchemas.meetupIdSchema, "params"),
  meetupController.deleteMeetup
);
router.post(
  "/meetups/:id/attend",
  passport.authenticate("jwt", { session: false }),
  validation(validatorSchemas.meetupIdSchema, "params"),
  meetupController.attendMeetup
);

module.exports = router;

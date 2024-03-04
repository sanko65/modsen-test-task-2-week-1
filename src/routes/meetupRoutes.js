const Router = require("express");
const passport = require("passport");
const router = new Router();
const validation = require("../common/middleware/validation");
const meetupController = require("../controllers/meetupController");
const checkRole = require("../common/middleware/checkRole");
const requestWrap = require("../common/middleware/requestWrap");
const {
  meetupIdSchema,
  createMeetupSchema,
  updateMeetupSchema,
} = require("../validators/meetup/index");

router.get(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  requestWrap(meetupController.getMeetups)
);
router.get(
  "/meetups/:id",
  passport.authenticate("jwt", { session: false }),
  validation(meetupIdSchema, "params"),
  requestWrap(meetupController.getMeetupsById)
);
router.post(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole(["moderator"]),
  validation(createMeetupSchema, "body"),
  requestWrap(meetupController.createMeetup)
);
router.put(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole(["moderator"]),
  validation(updateMeetupSchema, "body"),
  requestWrap(meetupController.updateMeetup)
);
router.delete(
  "/meetups/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole(["moderator"]),
  validation(meetupIdSchema, "params"),
  requestWrap(meetupController.deleteMeetup)
);
router.post(
  "/meetups/:id/attend",
  passport.authenticate("jwt", { session: false }),
  validation(meetupIdSchema, "params"),
  requestWrap(meetupController.attendMeetup)
);

module.exports = router;

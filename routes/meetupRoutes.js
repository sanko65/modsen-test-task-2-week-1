const Router = require("express");
const passport = require("passport");
const router = new Router();
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
  meetupController.getMeetupsById
);
router.post(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  meetupController.createMeetup
);
router.put(
  "/meetups",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  meetupController.updateMeetup
);
router.delete(
  "/meetups/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole,
  meetupController.deleteMeetup
);
router.post(
  "/meetups/:id/attend",
  passport.authenticate("jwt", { session: false }),
  meetupController.attendMeetup
);

module.exports = router;

const Router = require("express");
const passport = require("passport");
const router = new Router();
const meetupController = require("../controllers/meetupController");

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
router.post("/meetups", meetupController.createMeetup);
router.put("/meetups", meetupController.updateMeetup);
router.delete("/meetups/:id", meetupController.deleteMeetup);

module.exports = router;

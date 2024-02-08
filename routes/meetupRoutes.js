const Router = require("express");
const router = new Router();
const meetupController = require("../controllers/meetupController");

router.get("/meetups", meetupController.getMeetups);
router.get("/meetups/:id", meetupController.getMeetupsById);
router.post("/meetups", meetupController.createMeetup);
router.put("/meetups", meetupController.updateMeetup);
router.delete("/meetups/:id", meetupController.deleteMeetup);

module.exports = router;

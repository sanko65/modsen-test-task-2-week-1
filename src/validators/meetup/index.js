const createMeetupSchema = require("./validateCreateMeetup");
const updateMeetupSchema = require("./validateUpdateMeetup");
const meetupIdSchema = require("./validateMeetupId");

module.exports = {
  meetupIdSchema,
  createMeetupSchema,
  updateMeetupSchema,
};

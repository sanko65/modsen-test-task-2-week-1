const Joi = require("joi");

const updateMeetupSchema = Joi.object({
  meetup_id: Joi.number().integer().positive().required(),
  name: Joi.string().min(5).max(80).required(),
  description: Joi.string().min(5).max(300).required(),
  keywords: Joi.array()
    .items(Joi.string().min(2).max(30).required())
    .optional(),
  time: Joi.date().greater("now").required(),
  place: Joi.string().min(5).max(50).required(),
});

module.exports = updateMeetupSchema;

const Joi = require("joi");

const validateMeetupId = (meetupInfo) => {
  const meetupIdSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
  });

  return meetupIdSchema.validate(meetupInfo);
};

const validateCreateMeetup = (meetupInfo) => {
  const createMeetupSchema = Joi.object({
    name: Joi.string().min(5).max(80).required(),
    description: Joi.string().min(5).max(300).required(),
    keywords: Joi.array()
      .items(Joi.string().min(5).max(30).required())
      .optional(),
    time: Joi.date().greater("now").required(),
    place: Joi.string().min(5).max(50),
  });

  return createMeetupSchema.validate(meetupInfo);
};

const validateUpdateMeetup = (meetupInfo) => {
  const updateMeetupSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().min(5).max(80).required(),
    description: Joi.string().min(5).max(300).required(),
    keywords: Joi.array()
      .items(Joi.string().min(5).max(30).required())
      .optional(),
    time: Joi.date().greater("now").required(),
    place: Joi.string().min(5).max(50),
  });

  return updateMeetupSchema.validate(meetupInfo);
};

module.exports = {
  validateUpdateMeetup,
  validateCreateMeetup,
  validateMeetupId,
};
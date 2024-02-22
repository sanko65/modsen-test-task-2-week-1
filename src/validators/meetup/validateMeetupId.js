const Joi = require("joi");

const meetupIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = meetupIdSchema;

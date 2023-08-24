const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const bookingSchema = Joi.object({
  date: Joi.date().raw().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required(),
  bookedBy: Joi.objectId().required(),
  attended: Joi.boolean(),
  dean: Joi.objectId().required(),
});

module.exports = {
  bookingSchema,
};

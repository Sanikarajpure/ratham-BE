const Joi = require("@hapi/joi");
const CONSTANTS = require("../Constants/constants");

const stringPassswordError = new Error(
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum six in length"
);

const registerSchema = Joi.object({
  email: Joi.string().email().max(225).required(),
  password: Joi.string()
    .regex(CONSTANTS.APP_VALIDATIONS.strongPasswordRegex)
    .error(stringPassswordError)
    .required(),
  firstName: Joi.string().min(4).max(255).required(),
  lastName: Joi.string().max(225),
  universityId: Joi.string().min(6).max(12).required(),
  role: Joi.string().min(4).max(8).required(),
});

const loginSchema = Joi.object({
  universityId: Joi.string().min(6).max(12).required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

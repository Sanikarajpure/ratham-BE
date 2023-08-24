const { ApiError } = require("../middlewares/apiError");
const { User } = require("../models/user");
const { Session } = require("../models/session");
const { authService, userService } = require("../services");
const {
  registerSchema,
  loginSchema,
} = require("../validations/registerLoginValidations");
const sessionController = require("./session.controller");
const httpStatus = require("http-status");
require("dotenv").config();

const authController = {
  async register(req, res, next) {
    try {
      //validating using joi

      let value = await registerSchema.validateAsync(req.body);

      if (value) {
        //chechking if email is taken
        if (await User.uniIdTaken(value.universityId)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "User already exists!");
        }
        let user = await authService.createUser(
          value.email,
          value.password,
          value.firstName,
          value.lastName,
          value.universityId,
          value.role
        );

        res.status(httpStatus.CREATED).send({
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async signin(req, res, next) {
    try {
      //validating user login data using joi
      let value = await loginSchema.validateAsync(req.body);

      if (value) {
        const user = await authService.signInUniIdAndPassword(
          value.universityId,
          value.password
        );

        //setting access token
        let token = await authService.genAuthToken(user);

        res.status(httpStatus.OK).send({
          user,
          token,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = authController;

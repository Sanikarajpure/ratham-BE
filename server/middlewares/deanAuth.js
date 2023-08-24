const jwt = require("jsonwebtoken");
require("dotenv").config();
const httpStatus = require("http-status");
const userService = require("../services/user.service");
const { ApiError } = require("./apiError");

const deanAuth = () => async (req, res, next) => {
  try {
    let accessToken = req.headers["authorization"];

    if (!accessToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user!");
    }
    let authtoken = accessToken.split(" ")[1];
    let validToken = await userService.validateDeanToken(authtoken);

    if (validToken && accessToken) {
      req.authenticated = validToken;
      next();
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Access Denied!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = deanAuth;

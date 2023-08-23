const jwt = require("jsonwebtoken");
require("dotenv").config();
const httpStatus = require("http-status");
const userService = require("../services/user.service");
const { ApiError } = require("./apiError");

const auth = () => async (req, res, next) => {
  try {
    let accessToken = req.headers["authorization"];

    console.log(accessToken);
    if (!accessToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user!");
    }
    let authtoken = accessToken.split(" ")[1];
    let validToken = await userService.validateToken(authtoken);

    if (validToken && accessToken) {
      req.authenticated = validToken;
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = auth;

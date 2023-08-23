const { User } = require("../models/user");
const ApiError = require("../middlewares/apiError");
const httpStatus = require("http-status");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const validateToken = async (token) => {
  console.log(process.env.APP_SECRET);

  return jwt.verify(token, process.env.APP_SECRET);
};

const findUserByUniId = (universityId) => {
  return User.findOne({ universityId });
};

const findUserById = async (_id) => {
  return User.findById({ _id });
};

module.exports = {
  findUserByUniId,
  findUserById,
  validateToken,
};

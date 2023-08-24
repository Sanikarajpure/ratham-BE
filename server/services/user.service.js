const { User } = require("../models/user");
const ApiError = require("../middlewares/apiError");
const httpStatus = require("http-status");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    if (decoded.role === "student") {
      return decoded;
    }
  } catch (err) {
    console.log(err);
  }
};

const validateDeanToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    if (decoded.role === "dean") {
      return decoded;
    }
  } catch (err) {
    console.log(err);
  }
};

const findUserByUniId = (universityId) => {
  return User.findOne({ universityId });
};

const findUserById = async (_id) => {
  return User.findById({ _id });
};

const calculateDateForNextDay = (day) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayIndex = daysOfWeek.indexOf(day);
  const today = new Date();
  const todayIndex = today.getDay();
  const daysUntilNextDay = (currentDayIndex + (7 - todayIndex)) % 7;

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + daysUntilNextDay);

  return nextDay;
};

module.exports = {
  findUserByUniId,
  findUserById,
  validateToken,
  validateDeanToken,
  calculateDateForNextDay,
};

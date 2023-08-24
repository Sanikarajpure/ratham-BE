const { Session } = require("../models/session");
const httpStatus = require("http-status");
const { ApiError } = require("../middlewares/apiError");
const userService = require("./user.service");

const createSession = async (date, startTime, endTime, bookedBy, dean) => {
  try {
    if (await Session.sessionTaken(date)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This Session is already booked!"
      );
    }

    const session = new Session({
      date,
      startTime,
      endTime,
      bookedBy,
      dean,
    });

    await session.save();
    return session;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSession,
};

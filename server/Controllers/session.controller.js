const { ApiError } = require("../middlewares/apiError");
const { Session } = require("../models/session");
const { authService, userService, sessionService } = require("../services");
const { bookingSchema } = require("../validations/sessionValidations");
const httpStatus = require("http-status");
require("dotenv").config();

const sessionController = {
  async getFreeSessions(req, res, next) {
    try {
      const deanId = req.query.deanId;

      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      // Fetch booked sessions for the dean within the next month
      const bookedSessions = await Session.find({
        date: { $gte: today, $lt: nextMonth },
        dean: deanId,
        bookedBy: { $exists: true },
      });

      const bookedDates = bookedSessions.map((session) =>
        session.date.toLocaleDateString("en-GB")
      ); // Convert to DD/MM/YYYY format

      const freeSessions = [];

      for (
        let date = new Date(today);
        date < nextMonth;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toLocaleDateString("en-GB");

        if (
          (date.getDay() === 4 || date.getDay() === 5) &&
          !bookedDates.includes(dateString)
        ) {
          const sessionStartTime = new Date(date);
          sessionStartTime.setHours(10, 0, 0, 0);

          const sessionEndTime = new Date(date);
          sessionEndTime.setHours(11, 0, 0, 0);

          freeSessions.push({
            date: sessionStartTime,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
          });
        }
      }

      res.status(httpStatus.OK).send({
        freeSessions,
      });
    } catch (error) {
      next(error);
    }
  },

  async bookSession(req, res, next) {
    try {
      //validating using joi

      let value = await bookingSchema.validateAsync(req.body);

      if (value) {
        const currentDate = new Date();
        const sessionDate = new Date(value.date);

        if (sessionDate.getTime() < currentDate.getTime()) {
          return res
            .status(400)
            .json({ error: "Cannot book a session that has already passed." });
        } else {
          let session = await sessionService.createSession(
            value.date,
            value.startTime,
            value.endTime,
            value.bookedBy,
            value.dean
          );

          res.status(httpStatus.CREATED).send({
            session,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  async pendingSession(req, res, next) {
    try {
      const deanId = req.query.deanId;
      const currentDate = new Date();
      // Fetch pending sessions for the dean
      const pendingSessions = await Session.find({
        dean: deanId,
        bookedBy: { $exists: true },
        attended: false,
        date: { $gte: currentDate },
      }).populate({ path: "bookedBy", select: "firstName lastName" });

      res.status(httpStatus.OK).send({
        pendingSessions,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSession(req, res, next) {
    try {
      const sessionID = req.query.sessionId;
      const deanID = req.authenticated._id;

      // Find the session by ID and dean ID
      const session = await Session.findOne({
        _id: sessionID,
        dean: deanID,
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found!" });
      }

      const currentDate = new Date();
      const sessionDate = new Date(session.date);

      if (currentDate >= sessionDate) {
        return res
          .status(400)
          .json({ error: "Session has already passed and cannot be updated." });
      }

      session.attended = true;
      await session.save();

      res.status(httpStatus.OK).send({
        message: "Session updated.",
      });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = sessionController;

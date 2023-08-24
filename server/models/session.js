const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attended: { type: Boolean, default: false },
  dean: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

sessionSchema.statics.sessionTaken = async function (date) {
  const session = await this.findOne({ date });

  return !!session;
};

const Session = mongoose.model("Session", sessionSchema);

module.exports = { Session };

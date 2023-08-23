const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
    lastName: { type: String, required: true, maxLength: 100, trim: true },
    universityId: {
      type: String,
      required: true,
      maxLength: 12,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  let user = this;

  const userObj = { id: user._id.toHexString() };
  console.log(process.env.APP_SECRET);
  const token = jwt.sign(userObj, process.env.APP_SECRET, { expiresIn: "1d" });
  return token;
};

userSchema.methods.generateRegisterToken = function () {
  let user = this;

  const userObj = { sub: user._id.toHexString() };

  const token = jwt.sign(userObj, process.env.APP_SECRET, { expiresIn: "10h" });
  return token;
};

userSchema.statics.uniIdTaken = async function (universityId) {
  const user = await this.findOne({ universityId });

  return !!user;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  // candidatePassword == unhashed password
  const user = this;
  const match = await bcrypt.compare(candidatePassword, user.password);
  return match;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

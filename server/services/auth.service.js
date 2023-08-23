const { User } = require("../models/user");
const httpStatus = require("http-status");
const { ApiError } = require("../middlewares/apiError");
const userService = require("./user.service");

const createUser = async (
  email,
  password,
  firstName,
  lastName,
  universityId,
  role
) => {
  try {
    if (await User.uniIdTaken(universityId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "University Id already registered"
      );
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      universityId,
      role,
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const signInUniIdAndPassword = async (universityId, password) => {
  try {
    const user = await userService.findUserByUniId(universityId);
    console.log(user);
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "No user with this University Id"
      );
    }
    if (!(await user.comparePassword(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong password");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const genAuthToken = (user) => {
  try {
    const token = user.generateAuthToken();
    return token;
  } catch (error) {
    throw error;
  }
};
const setExpiry = (days) => {
  let date = new Date(Date.now() + days * 24 * 3600000);

  return date;
};

module.exports = {
  createUser,
  signInUniIdAndPassword,
  genAuthToken,
  setExpiry,
};

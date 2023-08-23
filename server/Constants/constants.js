require("dotenv").config();
module.exports = {
  APP: {},
  APP_VALIDATIONS: {
    idValidation: { version: "uuidv4" },
    strongPasswordRegex:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
    noWhiteSpaces: /^\S*$/,
  },
};

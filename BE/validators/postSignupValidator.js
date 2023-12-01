const { Joi, errors, celebrate, Segments } = require("celebrate");
const {
  emailValidation,
  passwordValidator,
  stringValidation,
} = require("./customeValidations");
const postSignupValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: emailValidation,
    password: stringValidation.custom(passwordValidator, "password validation"),
    username: stringValidation,
  }),
});

module.exports = postSignupValidator;

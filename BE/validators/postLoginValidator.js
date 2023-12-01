const { Joi, errors, celebrate, Segments } = require("celebrate");
const {
  emailValidation,
  passwordValidator,
  stringValidation,
} = require("./customeValidations");
const postLoginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: emailValidation,
    password: stringValidation.custom(passwordValidator, "password validation"),
  }),
});

module.exports = postLoginValidator;

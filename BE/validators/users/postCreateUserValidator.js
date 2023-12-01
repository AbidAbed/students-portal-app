const { Joi, errors, celebrate, Segments } = require("celebrate");
const {
  stringValidation,
  emailValidation,
  passwordValidator,
} = require("../customeValidations");
const postCreateUserValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.BODY]: Joi.object().keys({
    email: emailValidation,
    password: stringValidation.custom(passwordValidator, "password validation"),
    username: stringValidation,
    isActivated: Joi.boolean().required(),
  }),
});
module.exports = postCreateUserValidator;

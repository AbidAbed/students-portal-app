const { Joi, Segments, celebrate, errors } = require("celebrate");
const {
  stringValidation,
  numberValidation,
  emailValidation,
} = require("../customeValidations");

const putUserValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.BODY]: Joi.object().keys({
    id: numberValidation,
    email: emailValidation.optional(),
    username: stringValidation.optional(),
    isActivated: Joi.boolean().optional(),
  }),
});

module.exports = putUserValidator;

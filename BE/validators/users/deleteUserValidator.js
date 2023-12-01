const { Joi, errors, celebrate, Segments } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");
const deleteUserValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.BODY]: Joi.object().keys({
    id: numberValidation,
  }),
});

module.exports = deleteUserValidator;

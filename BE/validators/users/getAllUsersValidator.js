const { Joi, Segments, celebrate, errors } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");

const getAllUsersValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.QUERY]: Joi.object().keys({
    page: numberValidation.min(1),
  }),
});

module.exports = getAllUsersValidator;

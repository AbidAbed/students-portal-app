const { Joi, errors, celebrate, Segments } = require("celebrate");
const { stringValidation } = require("./customeValidations");
const postAuthValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
});

module.exports = postAuthValidator;

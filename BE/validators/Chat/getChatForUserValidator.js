const { Joi, Segments, celebrate, errors } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");

const getChatForUserValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.QUERY]: Joi.object().keys({
    user_id: numberValidation.min(1).required(),
    chat_with_id: numberValidation.min(1).required(),
  }),
});

module.exports = getChatForUserValidator;

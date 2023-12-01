const { Joi, Segments, celebrate, errors } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");

const postAddChatToUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: numberValidation.min(1).required(),
    msg: stringValidation.required(),
    time: numberValidation.min(1).required(),
    sender_id: numberValidation.min(1).required(),
    chat_with_id: numberValidation.min(1).required(),
  }),
});

module.exports = postAddChatToUserValidator;

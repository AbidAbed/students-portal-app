const { Joi, Segments, celebrate, errors } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");

const deleteUserSubjectValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.BODY]: Joi.object().keys({
    user_id: numberValidation,
    subject_id: numberValidation,
  }),
});

module.exports = deleteUserSubjectValidator;

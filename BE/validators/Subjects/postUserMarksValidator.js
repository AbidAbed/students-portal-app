const { Joi, Segments, celebrate, errors } = require("celebrate");
const { stringValidation, numberValidation } = require("../customeValidations");

const postUserMarksValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: stringValidation,
  }),
  [Segments.BODY]: Joi.object().keys({
    user_id: numberValidation,
    subjects: Joi.array().items(
      Joi.object().keys({
        id: numberValidation,
        mark: numberValidation,
      })
    ),
  }),
});

module.exports = postUserMarksValidator;

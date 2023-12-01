const { Joi } = require("celebrate");

const passwordValidator = (value, helpers) => {
  const passwordFirstCheck = /[0-9]{1,}/;
  const passwordSecondCheck = /[a-z]{1,}/;
  const passwordThirdCheck = /[A-Z]{1,}/;
  const passwordFourthCheck = /[~!@#$%^&*()_+\-=\\|{}\[\]?><;,.\"']+/;
  // Perform string check here
  if (
    !(
      value.match(passwordFirstCheck) &&
      value.match(passwordSecondCheck) &&
      value.match(passwordThirdCheck) &&
      value.match(passwordFourthCheck) &&
      value.length >= 8
    )
  ) {
    return helpers.message(
      "password is invalid it must includes at least 1 " +
        "numbers ,1 small letters , 1 capital letters and a special character"
    );
  }
  return value;
};

const numberValidation = Joi.number().integer().not().empty().required();

const stringValidation = Joi.string().not().empty().required();

const emailValidation = Joi.string().not().empty().required().email();

module.exports = {
  numberValidation,
  stringValidation,
  emailValidation,
  passwordValidator,
};

function passwordValidator(type, value) {
  const passwordFirstCheck = /[0-9]{1,}/;
  const passwordSecondCheck = /[a-z]{1,}/;
  const passwordThirdCheck = /[A-Z]{1,}/;
  const passwordFourthCheck = /[~!@#$%^&*()_+\-=\\|{}\[\]?><;,.\"']+/;
  // Perform string check here
  if (value === '') return `${type} feild can't be empty`;
  if (
    !(
      value.match(passwordFirstCheck) &&
      value.match(passwordSecondCheck) &&
      value.match(passwordThirdCheck) &&
      value.match(passwordFourthCheck) &&
      value.length >= 8
    )
  ) {
    return (
      'password is invalid it must includes at least 1 ' +
      'numbers ,1 small letters , 1 capital letters , a special character and the minimum allowed length is 8'
    );
  } else return '';
}
export default passwordValidator;

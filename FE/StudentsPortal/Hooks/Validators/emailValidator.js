function emailValidator(type, value) {
  const emailRegex = /[a-zA-Z0-9_]+[@][a-zA-Z0-9_]+[.][a-zA-Z0-9_]+/;
  if (value === '') return `${type} feild can't be empty`;
  if (!value.match(emailRegex)) return 'Error , please enter a valid email';
  else return '';
}
export default emailValidator;

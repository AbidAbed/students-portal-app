function numberValidator(type, value) {
  if (value === undefined || value === null || value === '')
    return `${type} can't be empty`;
  else if (Number(value) < 0) return `${type} can't be less than zero`;
  else return '';
}
export default numberValidator;

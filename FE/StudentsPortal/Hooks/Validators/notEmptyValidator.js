function notEmptyValidator(type, value) {
  if (value === undefined || value === null || value === '')
    return `${type} can't be empty`;
  else return '';
}
export default notEmptyValidator;

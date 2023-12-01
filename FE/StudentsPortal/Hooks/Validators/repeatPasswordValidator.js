function repeatPasswordValidator(type, value, ogPassword) {
  if (value === ogPassword) {
    return '';
  } else return "Repeated password and original password  don't match";
}

export default repeatPasswordValidator;

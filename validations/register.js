const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.role = !isEmpty(data.role) ? data.role : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name is Required';
  }
  if (validator.isEmpty(data.role)) {
    errors.role = 'Role is Required';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is Required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is an invalid format';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is Required';
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }
  if (validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password is required';
  }

  if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

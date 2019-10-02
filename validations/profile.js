const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInputs(data) {
  let errors = {};
  data.type = !isEmpty(data.type) ? data.type : '';
  data.name = !isEmpty(data.name) ? data.name : '';

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  if (validator.isEmpty(data.type)) {
    errors.type = 'Type is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

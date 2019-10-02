const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRFTInput(data) {
  let errors = {};

  data.vendor = !isEmpty(data.vendor) ? data.vendor : '';
  data.tender = !isEmpty(data.tender) ? data.tender : '';
  data.status = !isEmpty(data.status) ? data.status : '';

  if (validator.isEmpty(data.vendor)) {
    errors.vendor = 'Vendor is Required';
  }
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status is Required';
  }
  if (validator.isEmpty(data.tender)) {
    errors.tender = 'Tender is Required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

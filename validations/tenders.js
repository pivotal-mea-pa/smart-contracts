const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateTenderInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.brief = !isEmpty(data.brief) ? data.brief : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.rfpPurchaseStartDate = !isEmpty(data.rfpPurchaseStartDate)
    ? data.rfpPurchaseStartDate
    : '';
  data.rfpPurchaseEndDate = !isEmpty(data.rfpPurchaseEndDate)
    ? data.rfpPurchaseEndDate
    : '';
  data.rfpResponseStartDate = !isEmpty(data.rfpResponseStartDate)
    ? data.rfpResponseStartDate
    : '';
  data.rfpResponseEndDate = !isEmpty(data.rfpResponseEndDate)
    ? data.rfpResponseEndDate
    : '';

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name is Required';
  }
  if (validator.isEmpty(data.brief)) {
    errors.brief = 'Brief is Required';
  }
  if (validator.isEmpty(data.description)) {
    errors.description = 'Description is Required';
  }
  if (validator.isEmpty(data.rfpPurchaseStartDate)) {
    errors.rfpPurchaseStartDate = 'Date is Required';
  }
  if (validator.isEmpty(data.rfpPurchaseEndDate)) {
    errors.rfpPurchaseEndDate = 'Date is Required';
  }

  if (validator.isEmpty(data.rfpResponseStartDate)) {
    errors.rfpResponseStartDate = 'Date is Required';
  }
  if (validator.isEmpty(data.rfpResponseEndDate)) {
    errors.rfpResponseEndDate = 'Date is Required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const TenderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  brief: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  categories: {
    type: [String]
  },
  rfpPurchaseStartDate: {
    type: Date,
    required: true
  },
  rfpPurchaseEndDate: {
    type: Date,
    required: true
  },
  rfpResponseStartDate: {
    type: Date,
    required: true
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  },
  rfpResponseEndDate: {
    type: Date,
    required: true
  },
  entity: {
    type: Schema.Types.ObjectId,
    ref: 'profiles'
  },
  companies: {
    type: [Schema.Types.ObjectId],
    ref: 'profiles'
  },
  files: {
    type: [String]
  }
});

module.exports = Tender = mongoose.model('tenders', TenderSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const AwardSchema = new Schema({
  tender: {
    type: Schema.Types.ObjectId,
    ref: 'tenders'
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'profiles'
  },
  status: {
    type: String,
    required: true
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  bondBlockchainId: {
    type: String
  },
  smartContractId: {
    type: String
  }
});

module.exports = Award = mongoose.model('awards', AwardSchema);

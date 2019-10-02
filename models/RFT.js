const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const RFTSchema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'profiles'
  },
  tender: {
    type: Schema.Types.ObjectId,
    ref: 'tenders'
  },
  status: {
    type: String,
    required: true
  },
  bidValue: {
    type: String
  },
  vendorContact: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  }
});

module.exports = RFT = mongoose.model('rfts', RFTSchema);

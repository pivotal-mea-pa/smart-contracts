const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const RFPSchema = new Schema({
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
  technicalDocumentURL: {
    type: String
  },
  financialDocumentURL: {
    type: String
  },
  bidValue: {
    type: String
  },
  termsAgreed: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  },
  bondBlockchainId: {
    type: String
  },
  purchaseId: {
    type: String
  }
});

module.exports = RFP = mongoose.model('rfps', RFPSchema);

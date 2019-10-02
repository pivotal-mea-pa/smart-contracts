const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const RefundSchema = new Schema({
  tender: {
    type: Schema.Types.ObjectId,
    ref: 'tenders'
  },
  status: {
    type: String,
    required: true
  },
  value: {
    type: String
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

module.exports = Refund = mongoose.model('refunds', RefundSchema);

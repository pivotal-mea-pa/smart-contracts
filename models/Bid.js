const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const BidSchema = new Schema({
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
  value: {
    type: String
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Bid = mongoose.model('bids', BidSchema);

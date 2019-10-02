const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const BondSchema = new Schema({
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
  type: {
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

module.exports = Bond = mongoose.model('bonds', BondSchema);

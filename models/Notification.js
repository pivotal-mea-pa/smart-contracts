const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  tender: {
    type: Schema.Types.ObjectId,
    ref: 'tenders'
  },
  rft: {
    type: Schema.Types.ObjectId,
    ref: 'rfts'
  },
  rfp: {
    type: Schema.Types.ObjectId,
    ref: 'rfps'
  },
  EntityOrVendor: {
    type: Schema.Types.ObjectId,
    ref: 'profiles'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  }
});

module.exports = Notification = mongoose.model(
  'notifications',
  NotificationSchema
);

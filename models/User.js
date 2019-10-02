const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  position: {
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

module.exports = User = mongoose.model('users', UserSchema);

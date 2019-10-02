const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logoPath: {
    type: String
  },
  blockchainId: {
    type: String,
    default: uuid().substring(0, 10)
  },
  rating: {
    type: Number
  },
  municipalityLicenseNumber: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  certificateNumber: {
    type: String
  },
  unifiedNumber: {
    type: String
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  address3: {
    type: String
  },
  country: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  fax: {
    type: String
  },
  postcode: {
    type: String
  },
  blockchainCode: {
    type: String
  }
});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);

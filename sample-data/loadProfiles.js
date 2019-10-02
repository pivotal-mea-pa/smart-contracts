const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

const myFunc = async () => {
  let client = await mongo.connect(url);
  let db = client.db('smart-contracts-poc');
  try {
    db.collection('users')
      .find()
      .toArray(async (err, results) => {
        const res = await results.forEach(user => {
          if (user.role === 'Internal') {
            try {
              db.collection('profiles').insertOne({
                user: user._id,
                type: 'Internal',
                name: 'Internal Admin'
              });
            } catch (e) {
              console.log(e);
            }
          }
          if (user.role === 'Entity') {
            try {
              db.collection('profiles').insertOne({
                user: user._id,
                type: 'Entity',
                name: 'Higher Colleges of Technology'
              });
            } catch (e) {
              console.log(e);
            }
          }
          if (user.role === 'Vendor') {
            try {
              db.collection('profiles').insertOne({
                user: user._id,
                type: 'Vendor',
                name: 'DNS Solutions',
                blockchainId: 'US0E0BAmo26zvfQ3E',
                rating: 0,
                municipalityLicenseNumber: 'OBACdhoiR44TIQ2uqF',
                licenseNumber: '5cac4ce46309f044589fa8ab',
                certificateNumber: '2a$10$GhTJsgOBAC',
                unifiedNumber: '5cac4ce46309f04458',
                address1: '1 Main Street',
                address2: 'New Town',
                address3: 'Main Borough',
                country: 'Abi Dhabi',
                email: 'info@dns.fake',
                phone: '+971 2345678',
                fax: '+971 2345679',
                postcode: 'A8 DB22',
                blockchainCode: '6zvfQ3E/1MRr/1e'
              });
            } catch (e) {
              console.log(e);
            }
          }
        });
      });
  } finally {
    setTimeout(() => {
      client.close();
    }, 1000);
  }
};

myFunc();

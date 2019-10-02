var cfenv = require("cfenv");
const mongo = require('mongodb').MongoClient;

var appEnv = cfenv.getAppEnv()
var mongoCFUrl = appEnv.getServiceURL('smart-contracts-mongodb');
var url = 'mongodb://localhost:27017/';

if (mongoCFUrl != null) {
  console.log('mongoCFUrl detected = ' + mongoCFUrl)
	url=mongoCFUrl;
}
console.log('active mongo cf URL= ' + url);

mongoose
  .connect(url, { useNewUrlParser: true  ,useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const url = 'mongodb://localhost:27017/';

let password = '$2a$10$GhTJsgOBACdhoiR44TIQ2uqFaTv/US0E0BAmo26zvfQ3E/1MRr/1e';

mongo.connect(url, (err, url) => {
  if (err) {
    throw err;
  }
  const dbo = db.db('smart-contracts-poc');
  const users = [
    {
      name: 'Test InternalUser',
      email: 'internal@test.fake',
      password,
      role: 'Internal'
    },
    {
      name: 'Test EntityUser',
      email: 'entity@test.fake',
      password,
      role: 'Entity'
    },
    {
      name: 'Test VendorUser',
      email: 'vendor@test.fake',
      password,
      role: 'Vendor'
    }
  ];
  dbo.collection('users').insertMany(users, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`Number of documents inserted: ${res.insertedCount}`);
    db.close();
  });
});

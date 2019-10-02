const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const tenders = require('./routes/api/tenders');
const rfts = require('./routes/api/rfts');
const rfps = require('./routes/api/rfps');
const notifications = require('./routes/api/notifications');
const clarifications = require('./routes/api/clarifications');
const awards = require('./routes/api/awards');
const bonds = require('./routes/api/bonds');
const refunds = require('./routes/api/refunds');
const bids = require('./routes/api/bids');
var cfenv = require("cfenv");

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

var db = require('./config/keys').mongoURI;
console.log('Mongo URL from properties= ' + db);

var appEnv = cfenv.getAppEnv();
var mongoCFUrl = appEnv.getServiceURL('smart-contracts-mongodb');

if (mongoCFUrl != null) {
  console.log('mongoCFUrl detected = ' + mongoCFUrl)
	db=mongoCFUrl;
}
console.log('active mongo cf URL= ' + db);

mongoose
  .connect(db, { useNewUrlParser: true  ,useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('./config/passport.js')(passport);

//routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/tenders', tenders);
app.use('/api/rfts', rfts);
app.use('/api/rfps', rfps);
app.use('/api/notifications', notifications);
app.use('/api/awards', awards);
app.use('/api/clarifications', clarifications);
app.use('/api/refunds', refunds);
app.use('/api/bonds', bonds);
app.use('/api/bids', bids);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

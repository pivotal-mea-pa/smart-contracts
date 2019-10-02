const express = require('express');
const router = express.Router();
const passport = require('passport');

const Bid = require('../../models/Bid');

//@route  GET api/bids/test
//@desc   Test bids Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - clar endpoint' }));

//@route  POST api/bids/
//@desc   add bid Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Bid(req.body).save().then(bid => res.json(bid));
  }
);

//@route  GET api/bid/:id
//@desc   get bid Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bid.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'blockchainId'])
      .then(bid => {
        if (!bid) {
          errors.nobidRecordFound = 'No bid with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(bid);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/bid/by-tender/:id
//@desc   get bid by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bid.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'blockchainId'])
      .then(bids => {
        if (!bids) {
          errors.nobidRecordFound = 'No bids with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(bids);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

//@route  GET api/bids/by-vendor/:id
//@desc   get bids by vendor Route
//@access Private
router.get(
  '/by-vendor/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bid.find({ vendor: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId'])
      .then(bids => {
        if (!bids) {
          errors.norfpRecordFound = 'No bids with that vendor id found';
          return res.status(400).json(errors);
        } else {
          res.json(bids);
        }
      })
      .catch(err =>
        res.status(404).json({ noRfpsFound: 'No records with that Id Found' })
      );
  }
);

//@route  POST api/bids/:id
//@desc   edit bid Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const { status, type, tender } = req.body;
    if (status) updatedRecord.status = status;
    if (type) updatedRecord.type = type;
    if (tender) updatedRecord.tender = tender;
    Bid.findById(id).then(bid => {
      if (bid) {
        Bid.findByIdAndUpdate(id, { $set: updatedRecord }, { new: true }).then(
          bid => res.json(bid)
        );
      } else {
        errors.bid = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

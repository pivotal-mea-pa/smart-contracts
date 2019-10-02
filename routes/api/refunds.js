const express = require('express');
const router = express.Router();
const passport = require('passport');

const Refund = require('../../models/Refund');

//@route  GET api/refunds/test
//@desc   Test refunds Route
//@access Public
router.get('/test', (req, res) =>
  res.json({ msg: 'Api up - refund endpoint' })
);

//@route  POST api/refunds/
//@desc   add refund Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Refund(req.body).save().then(refund => res.json(refund));
  }
);

//@route  GET api/refund/:id
//@desc   get refund Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Refund.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .then(refund => {
        if (!refund) {
          errors.norefundRecordFound = 'No refund with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(refund);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/refund/by-tender/:id
//@desc   get refund by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Refund.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .then(refunds => {
        if (!refunds) {
          errors.norefundRecordFound = 'No refunds with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(refunds);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

//@route  POST api/refund/:id
//@desc   edit refund Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const { status, value, tender } = req.body;
    if (status) updatedRecord.status = status;
    if (value) updatedRecord.value = value;
    if (tender) updatedRecord.tender = tender;
    Refund.findById(id).then(refund => {
      if (refund) {
        Refund.findByIdAndUpdate(
          id,
          { $set: updatedRecord },
          { new: true }
        ).then(refund => res.json(refund));
      } else {
        errors.refund = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

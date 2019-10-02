const express = require('express');
const router = express.Router();
const passport = require('passport');

const RFT = require('../../models/RFT');

const validateRFTInput = require('../../validations/rft');

//@route  GET api/rfts/test
//@desc   Test rfts Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - rft endpoint' }));

//@route  POST api/rfts/
//@desc   add rft Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRFTInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    new RFT(req.body).save().then(rft => res.json(rft));
  }
);

//@route  GET api/rft/:id
//@desc   get rft Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFT.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('profile', ['name', 'type', 'blockchainId'])
      .then(rft => {
        if (!rft) {
          errors.norftRecordFound = 'No rft with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(rft);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/rft/:id
//@desc   get rft Route
//@access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFT.find()
      .populate('tender', [
        'name',
        'status',
        'categories',
        'rfpPurchaseEndDate',
        'blockchainId',
        'description'
      ])
      .populate('profile', ['name', 'type', 'blockchainId'])
      .then(rfts => {
        if (!rfts) {
          errors.norftsRecordFound = 'No rfts found';
          return res.status(400).json(errors);
        } else {
          res.json(rfts);
        }
      })
      .catch(err => res.status(404).json({ noRFTsFound: 'No records Found' }));
  }
);

//@route  GET api/rft/:tender_id
//@desc   get rft Route
//@access Private
router.get(
  '/tender/:tender_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFT.find({ tender: req.params.tender_id })
      .populate('tender', ['name', 'status', 'categories', 'blockchainId'])
      .populate('profile', ['name', 'type', 'blockchainId'])
      .then(rfts => {
        if (!rfts) {
          errors.norftsRecordFound = 'No rfts found';
          return res.status(400).json(errors);
        } else {
          res.json(rfts);
        }
      })
      .catch(err => res.status(404).json({ noRFTsFound: 'No records Found' }));
  }
);

//@route  GET api/rfp/by-vendor/:id
//@desc   get rfp by vendor Route
//@access Private
router.get(
  '/by-vendor/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFT.find({ vendor: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId'])
      .then(rfts => {
        if (!rfts) {
          errors.norfpRecordFound = 'No rfts with that vendor id found';
          return res.status(400).json(errors);
        } else {
          res.json(rfts);
        }
      })
      .catch(err =>
        res.status(404).json({ noRfpsFound: 'No records with that Id Found' })
      );
  }
);

//@route  POST api/rft/:id
//@desc   edit rft Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const { status } = req.body;
    if (status) updatedRecord.status = status;
    RFT.findById(id).then(rft => {
      if (rft) {
        RFT.findByIdAndUpdate(id, { $set: updatedRecord }, { new: true }).then(
          rft => res.json(rft)
        );
      } else {
        errors.rft = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

//@route  GET api/rfp/by-tender/:id
//@desc   get rfp by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFT.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId'])
      .then(rfts => {
        if (!rfts) {
          errors.norfpRecordFound = 'No rfts with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(rfts);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

module.exports = router;

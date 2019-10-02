const express = require('express');
const router = express.Router();
const passport = require('passport');

const Bond = require('../../models/Bond');

//@route  GET api/bonds/test
//@desc   Test bonds Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - clar endpoint' }));

//@route  POST api/bonds/
//@desc   add bond Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Bond(req.body).save().then(bond => res.json(bond));
  }
);

//@route  GET api/bond/:id
//@desc   get bond Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bond.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .then(bond => {
        if (!bond) {
          errors.nobondRecordFound = 'No bond with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(bond);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/bond/by-tender/:id
//@desc   get bond by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bond.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId'])
      .then(bonds => {
        if (!bonds) {
          errors.nobondRecordFound = 'No bonds with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(bonds);
        }
      })
      .catch(err => res.status(404).json({ err }));
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
    Bond.find({ vendor: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId'])
      .then(bonds => {
        if (!bonds) {
          errors.norfpRecordFound = 'No bonds with that vendor id found';
          return res.status(400).json(errors);
        } else {
          res.json(bonds);
        }
      })
      .catch(err =>
        res.status(404).json({ noBondsFound: 'No records with that Id Found' })
      );
  }
);

//@route  POST api/bond/:id
//@desc   edit bond Route
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
    Bond.findById(id).then(bond => {
      if (bond) {
        Bond.findByIdAndUpdate(id, { $set: updatedRecord }, { new: true }).then(
          bond => res.json(bond)
        );
      } else {
        errors.bond = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

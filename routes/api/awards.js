const express = require('express');
const router = express.Router();
const passport = require('passport');

const Award = require('../../models/Award');

//@route  GET api/awards/test
//@desc   Test awards Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - clar endpoint' }));

//@route  POST api/awards/
//@desc   add award Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Award(req.body).save().then(award => res.json(award));
  }
);

//@route  GET api/award/:id
//@desc   get award Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Award.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'blockchainId', 'rating'])
      .then(award => {
        if (!award) {
          errors.noawardRecordFound = 'No award with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(award);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/award/by-tender/:id
//@desc   get award by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Award.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'blockchainId', 'rating'])
      .then(awards => {
        if (!awards) {
          errors.noawardRecordFound = 'No awards with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(awards);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

//@route  GET api/awards/by-vendor/:id
//@desc   get awards by vendor Route
//@access Private
router.get(
  '/by-vendor/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Award.find({ vendor: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId', 'rating'])
      .then(awards => {
        if (!awards) {
          errors.norfpRecordFound = 'No awards with that vendor id found';
          return res.status(400).json(errors);
        } else {
          res.json(awards);
        }
      })
      .catch(err =>
        res.status(404).json({ noRfpsFound: 'No records with that Id Found' })
      );
  }
);

//@route  POST api/awards/:id
//@desc   edit award Route
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
    Award.findById(id).then(award => {
      if (award) {
        Award.findByIdAndUpdate(
          id,
          { $set: updatedRecord },
          { new: true }
        ).then(award => res.json(award));
      } else {
        errors.award = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Clarification = require('../../models/Clarification');

//@route  GET api/clarifications/test
//@desc   Test clarifications Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - clar endpoint' }));

//@route  POST api/clarifications/
//@desc   add clarification Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Clarification(req.body)
      .save()
      .then(clarification => res.json(clarification));
  }
);

//@route  GET api/clarification/:id
//@desc   get clarification Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Clarification.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .then(clarification => {
        if (!clarification) {
          errors.noclarificationRecordFound =
            'No clarification with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(clarification);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/clarification/by-tender/:id
//@desc   get clarification by tender Route
//@access Private
router.get(
  '/by-tender/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Clarification.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .then(clarifications => {
        if (!clarifications) {
          errors.noclarificationRecordFound =
            'No clarifications with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(clarifications);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

//@route  POST api/clarification/:id
//@desc   edit clarification Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const { status, message, tender } = req.body;
    if (status) updatedRecord.status = status;
    if (message) updatedRecord.message = message;
    if (tender) updatedRecord.tender = tender;
    Clarification.findById(id).then(clarification => {
      if (clarification) {
        Clarification.findByIdAndUpdate(
          id,
          { $set: updatedRecord },
          { new: true }
        ).then(clarification => res.json(clarification));
      } else {
        errors.clarification = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

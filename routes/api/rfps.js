const express = require('express');
const router = express.Router();
const passport = require('passport');

const RFP = require('../../models/RFP');

const validateRFPInput = require('../../validations/rfp');

//@route  GET api/rfps/test
//@desc   Test rfps Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Api up - rfp endpoint' }));

//@route  POST api/rfps/
//@desc   add rfp Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRFPInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    new RFP(req.body).save().then(rfp => res.json(rfp));
  }
);

//@route  GET api/rfp/:id
//@desc   get rfp Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    RFP.findById(req.params.id)
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId', 'rating'])
      .then(rfp => {
        if (!rfp) {
          errors.norfpRecordFound = 'No rfp with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(rfp);
        }
      })
      .catch(err =>
        res.status(404).json({ noExpenseFound: 'No record with that Id Found' })
      );
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
    RFP.find({ vendor: req.params.id })
      .populate('tender', ['name', 'status'])
      .populate('vendor', ['name', 'type', 'blockchainId', 'rating'])
      .then(rfps => {
        if (!rfps) {
          errors.norfpRecordFound = 'No rfps with that vendor id found';
          return res.status(400).json(errors);
        } else {
          res.json(rfps);
        }
      })
      .catch(err =>
        res.status(404).json({ noRfpsFound: 'No records with that Id Found' })
      );
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
    RFP.find({ tender: req.params.id })
      .populate('tender', ['name', 'status', 'blockchainId'])
      .populate('vendor', ['name', 'type', 'blockchainId', 'rating'])
      .then(rfps => {
        if (!rfps) {
          errors.norfpRecordFound = 'No rfps with that tender id found';
          return res.status(400).json(errors);
        } else {
          res.json(rfps);
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

//@route  POST api/rfp/:id
//@desc   edit rfp Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const {
      status,
      technicalDocumentURL,
      financialDocumentURL,
      termsAgreed,
      bidBindValue
    } = req.body;
    if (status) updatedRecord.status = status;
    if (technicalDocumentURL)
      updatedRecord.technicalDocumentURL = technicalDocumentURL;
    if (financialDocumentURL)
      updatedRecord.financialDocumentURL = financialDocumentURL;
    if (bidBindValue) updatedRecord.bidBindValue = bidBindValue;
    if (termsAgreed !== null && termsAgreed !== undefined) {
      updatedRecord.termsAgreed = termsAgreed;
    }
    RFP.findById(id).then(rfp => {
      if (rfp) {
        RFP.findByIdAndUpdate(id, { $set: updatedRecord }, { new: true }).then(
          rfp => res.json(rfp)
        );
      } else {
        errors.rfp = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

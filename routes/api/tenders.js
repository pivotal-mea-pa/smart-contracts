const express = require('express');
const router = express.Router();
const passport = require('passport');

const Tender = require('../../models/Tender');

const validateTenderInput = require('../../validations/tenders');

//@route  GET api/tender/test
//@desc   Test tender Route
//@access Public
router.get('/test', (req, res) =>
  res.json({ msg: 'Api up - Tender endpoint' })
);

//@route  POST api/tenders/
//@desc   add tender Route
//@access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTenderInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    new Tender(req.body).save().then(tender => res.json(tender));
  }
);

//@route  GET api/tenders/:id
//@desc   get tenders Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Tender.findById(req.params.id)
      .then(tender => {
        if (!tender) {
          errors.noTenderRecordFound = 'No tender with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(tender);
        }
      })
      .catch(err =>
        res.status(404).json({ noTenderFound: 'No record with that Id Found' })
      );
  }
);

//@route  GET api/tenders/:id
//@desc   get tenders Route
//@access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Tender.find()
      .then(tenders => {
        if (!tenders) {
          errors.noTendersRecordFound = 'No tenders found';
          return res.status(400).json(errors);
        } else {
          res.json(tenders);
        }
      })
      .catch(err =>
        res.status(404).json({ noTendersFound: 'No records Found' })
      );
  }
);

//@route  POST api/tenders/:id
//@desc   get tenders Route
//@access Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { id } = req.params;
    const updatedRecord = {};
    const {
      name,
      description,
      status,
      categories,
      documentUrls,
      rfpPurchaseStartDate,
      rfpPurchaseEndDate,
      rfpResponseStartDate,
      rfpResponseEndDate,
      blockHash,
      notifications
    } = req.body;
    if (blockHash) updatedRecord.blockHash = blockHash;
    if (notifications) updatedRecord.notifications = notifications;
    if (name) updatedRecord.name = name;
    if (description) updatedRecord.description = description;
    if (status) updatedRecord.status = status;
    if (categories) updatedRecord.categories = categories;
    if (documentUrls) updatedRecord.documentUrls = documentUrls;
    if (rfpPurchaseStartDate)
      updatedRecord.rfpPurchaseStartDate = rfpPurchaseStartDate;
    if (rfpPurchaseEndDate)
      updatedRecord.rfpPurchaseEndDate = rfpPurchaseEndDate;
    if (rfpResponseStartDate)
      updatedRecord.rfpResponseStartDate = rfpResponseStartDate;
    if (rfpResponseEndDate)
      updatedRecord.rfpResponseEndDate = rfpResponseEndDate;
    Tender.findById(id).then(tender => {
      if (tender) {
        Tender.findByIdAndUpdate(
          id,
          { $set: updatedRecord },
          { new: true }
        ).then(tender => res.json(tender));
      } else {
        errors.tender = 'Record not found';
        res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;

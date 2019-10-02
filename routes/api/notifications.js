const express = require('express');
const router = express.Router();
const passport = require('passport');

const Notification = require('../../models/Notification');

//@route  GET api/notifications/
//@desc   get Profile Route
//@access PRIVATE
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Notification.find()
      .populate('tender', ['name', 'status'])
      .populate('vendor', ['name'])
      .populate('createdBy', ['name', 'role'])
      .populate('EntityOrVendor', ['name'])
      .populate('rfp', ['status', 'bidValue'])
      .populate('rft', ['status'])
      .then(notifications => {
        if (!notifications) {
          errors.noNotificationsRecordFound = 'No Notifications found';
          return res.status(400).json(errors);
        } else {
          res.json(notifications);
        }
      })
      .catch(err =>
        res.status(404).json({ noNotificationsFound: 'No records Found' })
      );
  }
);

//@route  POST api/notifications/
//@desc   get Profile Route
//@access PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Notification(req.body)
      .save()
      .then(notification => res.json(notification));
  }
);

module.exports = router;

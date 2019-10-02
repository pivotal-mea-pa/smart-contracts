const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../models/Profile');
const ValidateProfileInput = require('../../validations/profile');

//@route  GET api/profile/test
//@desc   Test Profile Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'API up - Profile' }));

//@route  GET api/profile/
//@desc   get current user profile
//@access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'role'])
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route  POST api/profile/
//@desc   create or edit user profile
//@access Public

router.post('/', (req, res) => {
  const { errors, isValid } = ValidateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const profileFields = {};
  profileFields.user = req.body.user;
  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.name) profileFields.name = req.body.name;
  if (req.body.logoPath) profileFields.logoPath = req.body.logoPath;
  if (req.body.blockchainId) profileFields.blockchainId = req.body.blockchainId;
  if (req.body.rating) profileFields.rating = req.body.rating;
  if (req.body.municipalityLicenseNumber)
    profileFields.municipalityLicenseNumber =
      req.body.municipalityLicenseNumber;
  if (req.body.licenseNumber)
    profileFields.licenseNumber = req.body.licenseNumber;
  if (req.body.certificateNumber)
    profileFields.certificateNumber = req.body.certificateNumber;
  Profile.findOne({ user: req.body.user }).then(profile => {
    if (profile) {
      //UPDATE A PROFILE
      Profile.findOneAndUpdate(
        { user: req.body.user },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      //CREATE NEW PROFILE
      Profile.findOne({ name: profileFields.name }).then(profile => {
        //CHECK IF USERNAME EXISTS
        if (profile) {
          errors.name = 'Name already exists';
          res.status(400).json(errors);
        }

        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'role'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

//@route  GET api/profiles/:id
//@desc   get profiles Route
//@access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findById(req.params.id)
      .populate('user', ['name', 'role'])
      .then(profile => {
        if (!profile) {
          errors.noProfileRecordFound = 'No profile with that id found';
          return res.status(400).json(errors);
        } else {
          res.json(profile);
        }
      })
      .catch(err =>
        res.status(404).json({ noProfileFound: 'No record with that Id Found' })
      );
  }
);

module.exports = router;

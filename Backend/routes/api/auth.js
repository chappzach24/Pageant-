const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../../controllers/auth');
const { protect } = require('../../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty()
  ],
  authController.register
);

// @route   POST /api/auth/contestant-register
// @desc    Register as a contestant
// @access  Public
router.post(
  '/contestant-register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    // Optional fields
    check('biography', 'Biography must be less than 1000 characters').optional().isLength({ max: 1000 }),
    check('funFact', 'Fun fact must be less than 200 characters').optional().isLength({ max: 200 }),
    check('hairColor', 'Hair color must be a string').optional().isString(),
    check('eyeColor', 'Eye color must be a string').optional().isString()
  ],
  authController.contestantRegister
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET /api/auth/logout
// @desc    Logout user / clear cookie
// @access  Public
router.get('/logout', authController.logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getMe);

module.exports = router;
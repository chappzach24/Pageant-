// Backend/routes/api/contestantProfiles.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contestantProfileController = require('../../controllers/contestantProfile');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/proof-of-age';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename: userId-timestamp-originalname
    const uniquePrefix = `${req.user.id}-${Date.now()}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  }
});

// File filter for upload
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   GET /api/contestant-profiles
// @desc    Get current contestant profile
// @access  Private
router.get('/', protect, contestantProfileController.getProfile);

// @route   GET /api/contestant-profiles/complete
// @desc    Get complete contestant info (user + profile)
// @access  Private
router.get('/complete', protect, contestantProfileController.getCompleteContestantInfo);

// @route   GET /api/contestant-profiles/completeness
// @desc    Get profile completeness percentage
// @access  Private
router.get('/completeness', protect, contestantProfileController.getProfileCompleteness);

// @route   PUT /api/contestant-profiles
// @desc    Update contestant profile
// @access  Private
router.put(
  '/',
  [
    protect,
    [
      check('biography', 'Biography must be less than 1000 characters').optional().isLength({ max: 1000 }),
      check('funFact', 'Fun fact must be less than 200 characters').optional().isLength({ max: 200 }),
      check('hairColor', 'Hair color must be a string').optional().isString(),
      check('eyeColor', 'Eye color must be a string').optional().isString(),
      check('emergencyContactName', 'Emergency contact name must be a string').optional().isString(),
      check('emergencyContactPhone', 'Emergency contact phone must be a string').optional().isString(),
      check('allergies', 'Allergies must be a string').optional().isString(),
      check('medicalConditions', 'Medical conditions must be a string').optional().isString(),
      check('proofOfAgeType', 'Proof of age type must be valid').optional().isIn(['birth-certificate', 'id', 'passport', 'other'])
    ]
  ],
  contestantProfileController.updateProfile
);

// @route   POST /api/contestant-profiles/upload-proof-of-age
// @desc    Upload proof of age document
// @access  Private
router.post(
  '/upload-proof-of-age',
  protect,
  upload.single('document'), // 'document' is the field name for the file
  contestantProfileController.uploadProofOfAge
);

module.exports = router;
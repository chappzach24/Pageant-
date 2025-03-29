const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const participantController = require('../../controllers/participant');
const { protect } = require('../../middleware/auth');

// @route   POST /api/participants
// @desc    Register for a pageant
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('pageantId', 'Pageant ID is required').not().isEmpty(),
      check('categories', 'Categories must be an array').isArray()
    ]
  ],
  participantController.registerForPageant
);

// @route   GET /api/participants
// @desc    Get all participants for the logged-in user
// @access  Private
router.get('/', protect, participantController.getUserParticipations);

// @route   GET /api/participants/:id
// @desc    Get participant by ID
// @access  Private
router.get('/:id', protect, participantController.getParticipant);

// @route   GET /api/participants/pageant/:pageantId
// @desc    Get all participants for a pageant
// @access  Private (Only for pageant organizer)
router.get('/pageant/:pageantId', protect, participantController.getPageantParticipants);

// @route   PUT /api/participants/:id
// @desc    Update participant (withdraw or update categories)
// @access  Private
router.put(
  '/:id',
  [
    protect,
    [
      check('categories', 'Categories must be an array').optional().isArray()
    ]
  ],
  participantController.updateParticipant
);

// @route   DELETE /api/participants/:id
// @desc    Delete participation (withdraw completely)
// @access  Private
router.delete('/:id', protect, participantController.deleteParticipant);

module.exports = router;
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

// @route   PUT /api/participants/:id/scores
// @desc    Update participant scores
// @access  Private (Only for pageant organizer)
router.put(
  '/:id/scores',
  [
    protect,
    [
      check('categoryScores', 'Category scores array is required').isArray(),
      check('categoryScores.*.category', 'Category name is required').not().isEmpty(),
      check('categoryScores.*.score', 'Score must be a number between 0 and 10').isFloat({ min: 0, max: 10 })
    ]
  ],
  participantController.updateParticipantScores
);

// @route   DELETE /api/participants/:id
// @desc    Delete participation (withdraw completely)
// @access  Private
router.delete('/:id', protect, participantController.deleteParticipant);

module.exports = router;
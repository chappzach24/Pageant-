const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const scoringController = require('../../controllers/scoring');
const { protect } = require('../../middleware/auth');

// @route   GET /api/scoring/pageants
// @desc    Get all pageants for scoring dashboard
// @access  Private
router.get('/pageants', protect, scoringController.getScoringPageants);

// @route   GET /api/scoring/pageant/:id/details
// @desc    Get detailed scoring information for a specific pageant
// @access  Private
router.get('/pageant/:id/details', protect, scoringController.getPageantScoringDetails);

// @route   PUT /api/scoring/participant/:id/score
// @desc    Update individual participant's score for a category
// @access  Private
router.put(
  '/participant/:id/score',
  [
    protect,
    [
      check('category', 'Category is required').not().isEmpty(),
      check('score', 'Score must be a number between 0 and 10').isFloat({ min: 0, max: 10 }),
      check('notes', 'Notes must be a string').optional().isString()
    ]
  ],
  scoringController.updateParticipantScore
);

// @route   GET /api/scoring/pageant/:id/results
// @desc    Get final results/rankings for a pageant
// @access  Private
router.get('/pageant/:id/results', protect, scoringController.getPageantResults);

// @route   POST /api/scoring/pageant/:id/export
// @desc    Export pageant results
// @access  Private
router.post('/pageant/:id/export', protect, scoringController.exportPageantResults);

module.exports = router;
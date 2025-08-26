const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const applicationController = require('../../controllers/application');
const { protect } = require('../../middleware/auth');

// @route   GET /api/applications/pageants
// @desc    Get all pageants with application summaries for organization owner
// @access  Private
router.get('/pageants', protect, applicationController.getPageantsWithApplications);

// @route   GET /api/applications/stats
// @desc    Get application statistics for organization owner
// @access  Private
router.get('/stats', protect, applicationController.getApplicationStats);

// @route   GET /api/applications/pageant/:pageantId
// @desc    Get all applications for a specific pageant
// @access  Private
router.get('/pageant/:pageantId', protect, applicationController.getPageantApplications);

// @route   PUT /api/applications/:applicationId/approve
// @desc    Approve an application
// @access  Private
router.put(
  '/:applicationId/approve',
  [
    protect,
    [
      check('notes', 'Notes must be a string').optional().isString()
    ]
  ],
  applicationController.approveApplication
);

// @route   PUT /api/applications/:applicationId/reject
// @desc    Reject an application
// @access  Private
router.put(
  '/:applicationId/reject',
  [
    protect,
    [
      check('notes', 'Notes must be a string').optional().isString(),
      check('refundPayment', 'Refund payment must be a boolean').optional().isBoolean()
    ]
  ],
  applicationController.rejectApplication
);

// @route   PUT /api/applications/bulk-approve
// @desc    Bulk approve multiple applications
// @access  Private
router.put(
  '/bulk-approve',
  [
    protect,
    [
      check('applicationIds', 'Application IDs array is required').isArray().notEmpty(),
      check('notes', 'Notes must be a string').optional().isString()
    ]
  ],
  applicationController.bulkApproveApplications
);

// @route   PUT /api/applications/:applicationId/update-notes
// @desc    Update application notes
// @access  Private
router.put(
  '/:applicationId/update-notes',
  [
    protect,
    [
      check('notes', 'Notes must be a string').optional().isString()
    ]
  ],
  applicationController.updateApplicationNotes
);

module.exports = router;
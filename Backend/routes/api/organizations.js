const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const organizationController = require('../../controllers/organization');
const { protect } = require('../../middleware/auth');

// @route   POST /api/organizations
// @desc    Create a new organization
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('name', 'Organization name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('contactEmail', 'Contact email is required').isEmail()
    ]
  ],
  organizationController.createOrganization
);

// @route   GET /api/organizations
// @desc    Get all organizations
// @access  Public
router.get('/', organizationController.getOrganizations);

// @route   GET /api/organizations/user
// @desc    Get organizations owned by the logged-in user
// @access  Private
router.get('/user', protect, organizationController.getUserOrganizations);

// @route   GET /api/organizations/:id
// @desc    Get organization by ID
// @access  Public
router.get('/:id', organizationController.getOrganization);

// @route   PUT /api/organizations/:id
// @desc    Update organization
// @access  Private
router.put(
  '/:id',
  [
    protect,
    [
      check('name', 'Organization name is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('contactEmail', 'Valid contact email is required').optional().isEmail()
    ]
  ],
  organizationController.updateOrganization
);

// @route   DELETE /api/organizations/:id
// @desc    Delete organization
// @access  Private
router.delete('/:id', protect, organizationController.deleteOrganization);

module.exports = router;
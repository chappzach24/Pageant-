const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const pageantController = require("../../controllers/pageant");
const { protect } = require("../../middleware/auth");

// @route   POST /api/pageants
// @desc    Create a new pageant
// @access  Private
router.post(
  "/",
  [
    protect,
    [
      check("name", "Pageant name is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("organization", "Organization is required").not().isEmpty(),
      check("startDate", "Start date is required").not().isEmpty(),
      check("endDate", "End date is required").not().isEmpty(),
      check("competitionYear", "Competition year is required").isNumeric(),
      check("registrationDeadline", "Registration deadline is required")
        .not()
        .isEmpty(),
      check("ageGroups", "At least one age group is required")
        .isArray()
        .notEmpty(),
        check('entryFee.amount', 'Entry fee amount is required').isNumeric().custom((value) => value >= 0),
        check('entryFee.currency', 'Entry fee currency is required').not().isEmpty()
      
    ],
  ],
  pageantController.createPageant
);

// @route   GET /api/pageants
// @desc    Get all public pageants
// @access  Public
router.get("/", pageantController.getPageants);

// @route   GET /api/pageants/:id
// @desc    Get pageant by ID
// @access  Public/Private (depending on isPublic flag)
router.get("/:id", pageantController.getPageant);

// @route   GET /api/pageants/organization/:orgId
// @desc    Get all pageants for an organization
// @access  Public/Private (depending on isPublic flag)
router.get("/organization/:orgId", pageantController.getOrganizationPageants);

// @route   PUT /api/pageants/:id
// @desc    Update pageant
// @access  Private
router.put(
  "/:id",
  [
    protect,
    [
      check("name", "Pageant name is required").optional().not().isEmpty(),
      check("description", "Description is required")
        .optional()
        .not()
        .isEmpty(),
      check("startDate", "Start date is required").optional().not().isEmpty(),
      check("endDate", "End date is required").optional().not().isEmpty(),
      check("competitionYear", "Competition year is required")
        .optional()
        .isNumeric(),
      check("registrationDeadline", "Registration deadline is required")
        .optional()
        .not()
        .isEmpty(),
      check("ageGroups", "At least one age group is required")
        .optional()
        .isArray()
        .notEmpty(),
    ],
  ],
  pageantController.updatePageant
);

// @route   PUT /api/pageants/:id/status
// @desc    Update pageant status
// @access  Private
router.put(
  "/:id/status",
  [protect, [check("status", "Status is required").not().isEmpty()]],
  pageantController.updatePageantStatus
);

// @route   GET /api/pageants/:id/scores
// @desc    Get all participants' scores for a pageant
// @access  Private
router.get("/:id/scores", protect, pageantController.getPageantScores);

// @route   DELETE /api/pageants/:id
// @desc    Delete pageant
// @access  Private
router.delete("/:id", protect, pageantController.deletePageant);

// @route   GET /api/pageants/search/:pageantId
// @desc    Find a pageant by its pageantID
// @access  Public
router.get("/search/:pageantId", pageantController.findPageantById);

module.exports = router;

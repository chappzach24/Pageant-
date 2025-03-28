const Pageant = require('../models/Pageant');
const Organization = require('../models/Organization');
const { validationResult } = require('express-validator');

// @route   POST /api/pageants
// @desc    Create a new pageant
// @access  Private
exports.createPageant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      organization,
      startDate,
      endDate,
      competitionYear,
      location,
      registrationDeadline,
      maxParticipants,
      entryFee,
      ageGroups,
      categories,
      prizes,
      status,
      isPublic
    } = req.body;

    // Check if user owns the organization
    const org = await Organization.findById(organization);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    if (org.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to create pageants for this organization'
      });
    }

    // Create new pageant
    const pageant = new Pageant({
      name,
      description,
      organization,
      startDate,
      endDate,
      competitionYear,
      location,
      registrationDeadline,
      maxParticipants,
      entryFee,
      ageGroups,
      categories,
      prizes,
      status,
      isPublic
    });

    await pageant.save();

    res.status(201).json({
      success: true,
      pageant
    });
  } catch (error) {
    console.error('Create pageant error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   GET /api/pageants
// @desc    Get all public pageants
// @access  Public
exports.getPageants = async (req, res) => {
  try {
    const pageants = await Pageant.find({ isPublic: true })
      .populate('organization', 'name')
      .sort({ startDate: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: pageants.length,
      pageants
    });
  } catch (error) {
    console.error('Get pageants error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/pageants/:id
// @desc    Get pageant by ID
// @access  Public/Private (depending on isPublic flag)
exports.getPageant = async (req, res) => {
  try {
    const pageant = await Pageant.findById(req.params.id)
      .populate('organization', 'name description contactEmail');

    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // If pageant is not public, check if user owns the organization
    if (!pageant.isPublic) {
      // If not authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to view this pageant'
        });
      }

      const org = await Organization.findById(pageant.organization);
      if (org.owner.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to view this pageant'
        });
      }
    }

    res.json({
      success: true,
      pageant
    });
  } catch (error) {
    console.error('Get pageant error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/pageants/organization/:orgId
// @desc    Get all pageants for an organization
// @access  Public/Private (depending on isPublic flag)
exports.getOrganizationPageants = async (req, res) => {
  try {
    const { orgId } = req.params;
    
    // Check if organization exists
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    let query = { organization: orgId };
    
    // If user is not the organization owner, only show public pageants
    if (!req.user || organization.owner.toString() !== req.user.id) {
      query.isPublic = true;
    }

    const pageants = await Pageant.find(query)
      .sort({ startDate: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: pageants.length,
      pageants
    });
  } catch (error) {
    console.error('Get organization pageants error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/pageants/:id
// @desc    Update pageant
// @access  Private
exports.updatePageant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pageant = await Pageant.findById(req.params.id);

    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if user owns the organization
    const org = await Organization.findById(pageant.organization);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    if (org.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this pageant'
      });
    }

    // Update fields
    const updateFields = { ...req.body };
    
    // Don't allow changing the organization
    delete updateFields.organization;

    const updatedPageant = await Pageant.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      pageant: updatedPageant
    });
  } catch (error) {
    console.error('Update pageant error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   DELETE /api/pageants/:id
// @desc    Delete pageant
// @access  Private
exports.deletePageant = async (req, res) => {
  try {
    const pageant = await Pageant.findById(req.params.id);

    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if user owns the organization
    const org = await Organization.findById(pageant.organization);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    if (org.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this pageant'
      });
    }

    await pageant.remove();

    res.json({
      success: true,
      message: 'Pageant removed'
    });
  } catch (error) {
    console.error('Delete pageant error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
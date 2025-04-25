const Pageant = require('../models/Pageant');
const Organization = require('../models/Organization');
const Participant = require('../models/Participant');
const { validationResult } = require('express-validator');

// Generates a random pageant Id
const generatePageantID = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let pageantID = '';
  
  // Keep generating IDs until we find a unique one
  while (!isUnique) {
    pageantID = 'PAG';
    
    // Generate 5 random alphanumeric characters
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      pageantID += characters.charAt(randomIndex);
    }
    
    // Check if this ID already exists in the database
    const existingPageant = await Pageant.findOne({ pageantID });
    
    // If no pageant with this ID exists, we've found a unique ID
    if (!existingPageant) {
      isUnique = true;
    }
  }
  
  return pageantID;
};

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

    // Generate a unique pageant ID
    const pageantID = await generatePageantID();

    // Create new pageant
    const pageant = new Pageant({
      name,
      pageantID,
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

// @route   PUT /api/pageants/:id/status
// @desc    Update pageant status
// @access  Private
exports.updatePageantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    // Check valid status
    const validStatuses = ['draft', 'published', 'registration-closed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

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

    // Update status
    pageant.status = status;
    await pageant.save();

    res.json({
      success: true,
      pageant: {
        _id: pageant._id,
        name: pageant.name,
        status: pageant.status,
        registrationOpen: pageant.registrationOpen
      }
    });
  } catch (error) {
    console.error('Update pageant status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/pageants/:id/scores
// @desc    Get all participants' scores for a pageant
// @access  Private (Organization owner only)
exports.getPageantScores = async (req, res) => {
  try {
    const pageant = await Pageant.findById(req.params.id)
      .populate('organization', 'owner name');
    
    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }
    
    // Check if user is authorized (pageant organizer)
    if (pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this pageant\'s scores'
      });
    }
    
    // Get all participants with their scores
    const participants = await Participant.find({ pageant: req.params.id })
      .populate('user', 'username firstName lastName')
      .sort({ ageGroup: 1 }); // Sort by age group
    
    // Organize participants by age group
    const scoresByAgeGroup = {};
    
    pageant.ageGroups.forEach(ageGroup => {
      scoresByAgeGroup[ageGroup] = participants
        .filter(p => p.ageGroup === ageGroup)
        .map(p => ({
          participantId: p._id,
          user: p.user,
          categories: p.categories
        }));
    });
    
    res.json({
      success: true,
      pageant: {
        id: pageant._id,
        name: pageant.name,
        organization: pageant.organization.name
      },

      scoresByAgeGroup
    });
  } catch (error) {
    console.error('Get pageant scores error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/pageants/search/:pageantId
// @desc    Find a pageant by its pageantID
// @access  Public
exports.findPageantById = async (req, res) => {
  try {
    const { pageantId } = req.params;
    
    // Find pageant by pageantID
    const pageant = await Pageant.findOne({ pageantID: pageantId })
      .populate('organization', 'name description contactEmail');
    
    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }
    
    // Check if pageant is published and public
    if (pageant.status !== 'published' || !pageant.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'This pageant is not currently available for registration'
      });
    }
    
    // Check if registration is still open
    const now = new Date();
    if (now > pageant.registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Registration for this pageant has closed'
      });
    }
    
    // Check if maximum participants limit is reached
    if (pageant.maxParticipants > 0) {
      const participantCount = await Participant.countDocuments({ pageant: pageant._id });
      if (participantCount >= pageant.maxParticipants) {
        return res.status(400).json({
          success: false,
          error: 'This pageant has reached its maximum number of participants'
        });
      }
    }
    
    res.json({
      success: true,
      pageant
    });
  } catch (error) {
    console.error('Find pageant by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
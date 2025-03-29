const Participant = require('../models/Participant');
const Pageant = require('../models/Pageant');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { validationResult } = require('express-validator');

// @route   POST /api/participants
// @desc    Register for a pageant
// @access  Private
exports.registerForPageant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pageantId, categories } = req.body;

    // Check if pageant exists
    const pageant = await Pageant.findById(pageantId);
    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if registration is open
    const now = new Date();
    if (pageant.status !== 'published' || now > pageant.registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Registration is closed for this pageant'
      });
    }

    // Check if maximum participants limit is reached
    if (pageant.maxParticipants > 0) {
      const participantCount = await Participant.countDocuments({ pageant: pageantId });
      if (participantCount >= pageant.maxParticipants) {
        return res.status(400).json({
          success: false,
          error: 'This pageant has reached its maximum number of participants'
        });
      }
    }

    // Check if user is already registered for this pageant
    const existingParticipant = await Participant.findOne({
      user: req.user.id,
      pageant: pageantId
    });

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        error: 'You are already registered for this pageant'
      });
    }

    // Get user data to determine age group
    const user = await User.findById(req.user.id);
    
    // Determine age group based on the competition year
    const competitionYear = pageant.competitionYear;
    const januaryFirst = new Date(competitionYear, 0, 1);
    const birthDate = new Date(user.dateOfBirth);
    
    let age = januaryFirst.getFullYear() - birthDate.getFullYear();
    
    if (birthDate.getMonth() > 0 || (birthDate.getMonth() === 0 && birthDate.getDate() > 1)) {
      age--; // Adjust if birthday hasn't occurred yet by January 1st
    }
    
    // Determine age group
    let ageGroup;
    if (age >= 5 && age <= 8) ageGroup = '5 - 8 Years';
    else if (age >= 9 && age <= 12) ageGroup = '9 - 12 Years';
    else if (age >= 13 && age <= 18) ageGroup = '13 - 18 Years';
    else if (age >= 19 && age <= 39) ageGroup = '19 - 39 Years';
    else if (age >= 40) ageGroup = '40+ Years';
    else {
      return res.status(400).json({
        success: false,
        error: 'You do not meet the age requirements for this pageant'
      });
    }

    // Check if the pageant has this age group
    if (!pageant.ageGroups.includes(ageGroup)) {
      return res.status(400).json({
        success: false,
        error: `This pageant does not have your age group (${ageGroup})`
      });
    }

    // Validate categories
    const formattedCategories = [];
    
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'You must select at least one category'
      });
    }

    // Format categories for storage
    for (const category of categories) {
      // Check if the category exists in the pageant
      const categoryExists = pageant.categories.some(c => c.name === category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: `Category "${category}" does not exist in this pageant`
        });
      }
      
      formattedCategories.push({
        category: category
      });
    }

    // Create new participant
    const participant = new Participant({
      user: req.user.id,
      pageant: pageantId,
      categories: formattedCategories,
      ageGroup,
      paymentAmount: categories.length * 5 // $5 per category (platform fee)
    });

    await participant.save();

    res.status(201).json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Register for pageant error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   GET /api/participants
// @desc    Get all participants for the logged-in user
// @access  Private
exports.getUserParticipations = async (req, res) => {
  try {
    const participants = await Participant.find({ user: req.user.id })
      .populate('pageant', 'name startDate endDate location status')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (error) {
    console.error('Get user participations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/participants/:id
// @desc    Get participant by ID
// @access  Private
exports.getParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
      .populate('pageant')
      .populate('user', 'username firstName lastName email');

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    const isOwner = participant.user._id.toString() === req.user.id;
    const pageant = await Pageant.findById(participant.pageant);
    const organization = await Organization.findById(pageant.organization);
    const isOrganizer = organization.owner.toString() === req.user.id;

    if (!isOwner && !isOrganizer) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this participation'
      });
    }

    res.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Get participant error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/participants/pageant/:pageantId
// @desc    Get all participants for a pageant
// @access  Private (Only for pageant organizer)
exports.getPageantParticipants = async (req, res) => {
  try {
    const pageant = await Pageant.findById(req.params.pageantId);
    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if user is the pageant organizer
    const organization = await Organization.findById(pageant.organization);
    if (organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view participants for this pageant'
      });
    }

    const participants = await Participant.find({ pageant: req.params.pageantId })
      .populate('user', 'username firstName lastName email dateOfBirth')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (error) {
    console.error('Get pageant participants error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/participants/:id
// @desc    Update participant (withdraw or update categories)
// @access  Private
exports.updateParticipant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    // Check if the participant is the user
    if (participant.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this participation'
      });
    }

    // Check if pageant has already started
    const pageant = await Pageant.findById(participant.pageant);
    const now = new Date();
    if (now > pageant.startDate) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update participation after pageant has started'
      });
    }

    const { status, categories } = req.body;

    // Update fields if provided
    if (status) {
      // Users can only withdraw themselves
      if (status === 'withdrawn') {
        participant.status = status;
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid status update'
        });
      }
    }

    // Update categories if provided
    if (categories && Array.isArray(categories)) {
      // Validate categories
      const formattedCategories = [];
      
      for (const category of categories) {
        // Check if the category exists in the pageant
        const categoryExists = pageant.categories.some(c => c.name === category);
        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            error: `Category "${category}" does not exist in this pageant`
          });
        }
        
        formattedCategories.push({
          category: category
        });
      }
      
      participant.categories = formattedCategories;
      // Update payment amount based on number of categories
      participant.paymentAmount = categories.length * 5; // $5 per category
    }

    await participant.save();

    res.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   DELETE /api/participants/:id
// @desc    Delete participation (withdraw completely)
// @access  Private
exports.deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    // Check if the participant is the user
    if (participant.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this participation'
      });
    }

    // Check if pageant has already started
    const pageant = await Pageant.findById(participant.pageant);
    const now = new Date();
    if (now > pageant.startDate) {
      return res.status(400).json({
        success: false,
        error: 'Cannot withdraw after pageant has started'
      });
    }

    await participant.remove();

    res.json({
      success: true,
      message: 'Participation removed'
    });
  } catch (error) {
    console.error('Delete participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
const Pageant = require('../models/Pageant');
const Participant = require('../models/Participant');
const Organization = require('../models/Organization');
const { validationResult } = require('express-validator');

// @route   GET /api/scoring/pageants
// @desc    Get all pageants for scoring dashboard (organization owner only)
// @access  Private
exports.getScoringPageants = async (req, res) => {
  try {
    // Get user's organizations
    const organizations = await Organization.find({ owner: req.user.id });
    
    if (organizations.length === 0) {
      return res.json({
        success: true,
        pageants: []
      });
    }
    
    const orgIds = organizations.map(org => org._id);
    
    // Get all pageants for user's organizations
    const pageants = await Pageant.find({ 
      organization: { $in: orgIds }
    })
    .populate('organization', 'name')
    .sort({ startDate: -1 });
    
    // Enhance pageants with scoring information
    const enhancedPageants = await Promise.all(
      pageants.map(async (pageant) => {
        // Get participants count
        const participantCount = await Participant.countDocuments({ 
          pageant: pageant._id 
        });
        
        // Get participants with scores to calculate progress
        const participants = await Participant.find({ 
          pageant: pageant._id 
        }).select('categories');
        
        // Calculate scoring status
        let scoringStatus = 'pending';
        const now = new Date();
        const startDate = new Date(pageant.startDate);
        const endDate = new Date(pageant.endDate);
        
        if (pageant.status === 'in-progress' && now >= startDate && now <= endDate) {
          scoringStatus = 'active';
        } else if (pageant.status === 'completed' || now > endDate) {
          scoringStatus = 'completed';
        } else if (pageant.status === 'published' && now < startDate) {
          scoringStatus = 'pending';
        }
        
        // Calculate category completion
        const totalCategories = pageant.categories?.length || 0;
        let categoriesCompleted = 0;
        
        if (participants.length > 0 && totalCategories > 0) {
          // Count categories that have at least one score
          const scoredCategories = new Set();
          participants.forEach(participant => {
            participant.categories?.forEach(cat => {
              if (cat.score > 0) {
                scoredCategories.add(cat.category);
              }
            });
          });
          categoriesCompleted = scoredCategories.size;
        }
        
        return {
          _id: pageant._id,
          name: pageant.name,
          status: pageant.status,
          startDate: pageant.startDate,
          endDate: pageant.endDate,
          organization: pageant.organization,
          totalContestants: participantCount,
          totalCategories,
          categoriesCompleted,
          scoringStatus,
          currentCategory: pageant.categories?.[0]?.name || null
        };
      })
    );
    
    res.json({
      success: true,
      pageants: enhancedPageants
    });
  } catch (error) {
    console.error('Get scoring pageants error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/scoring/pageant/:id/details
// @desc    Get detailed scoring information for a specific pageant
// @access  Private
exports.getPageantScoringDetails = async (req, res) => {
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
        error: 'Not authorized to view this pageant\'s scoring details'
      });
    }
    
    // Get all participants with their scores
    const participants = await Participant.find({ pageant: req.params.id })
      .populate('user', 'username firstName lastName')
      .sort({ ageGroup: 1 });
    
    // Organize participants by age group
    const participantsByAgeGroup = {};
    
    pageant.ageGroups.forEach(ageGroup => {
      participantsByAgeGroup[ageGroup] = participants
        .filter(p => p.ageGroup === ageGroup)
        .map(p => ({
          participantId: p._id,
          user: p.user,
          categories: p.categories,
          ageGroup: p.ageGroup
        }));
    });
    
    res.json({
      success: true,
      pageant: {
        id: pageant._id,
        name: pageant.name,
        organization: pageant.organization.name,
        categories: pageant.categories,
        ageGroups: pageant.ageGroups,
        status: pageant.status
      },
      participantsByAgeGroup
    });
  } catch (error) {
    console.error('Get pageant scoring details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/scoring/participant/:id/score
// @desc    Update individual participant's score for a category
// @access  Private
exports.updateParticipantScore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the participant
    const participant = await Participant.findById(req.params.id)
      .populate({
        path: 'pageant',
        select: 'organization categories status',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      })
      .populate('user', 'username firstName lastName');
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    // Check if user is the pageant organizer
    if (participant.pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update scores for this pageant'
      });
    }

    // Check if pageant is in progress or completed
    if (participant.pageant.status !== 'in-progress' && participant.pageant.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Scores can only be updated for pageants in progress or completed'
      });
    }

    // Get category and score from request
    const { category, score, notes } = req.body;

    // Find the category in the participant's categories
    const categoryIndex = participant.categories.findIndex(
      c => c.category === category
    );

    if (categoryIndex === -1) {
      return res.status(400).json({
        success: false,
        error: `Participant is not registered for category: ${category}`
      });
    }

    // Update the score and notes
    participant.categories[categoryIndex].score = score;
    if (notes) {
      participant.categories[categoryIndex].notes = notes;
    }

    // Save the updated participant
    await participant.save();

    res.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Update participant score error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/scoring/pageant/:id/results
// @desc    Get final results/rankings for a pageant
// @access  Private
exports.getPageantResults = async (req, res) => {
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
        error: 'Not authorized to view this pageant\'s results'
      });
    }
    
    // Get all participants with their scores
    const participants = await Participant.find({ pageant: req.params.id })
      .populate('user', 'username firstName lastName')
      .sort({ ageGroup: 1 });
    
    // Calculate results by age group
    const resultsByAgeGroup = {};
    
    pageant.ageGroups.forEach(ageGroup => {
      const ageGroupParticipants = participants.filter(p => p.ageGroup === ageGroup);
      
      // Calculate average scores for each participant
      const participantsWithScores = ageGroupParticipants.map(participant => {
        const totalScore = participant.categories.reduce((sum, cat) => sum + (cat.score || 0), 0);
        const avgScore = participant.categories.length > 0 ? totalScore / participant.categories.length : 0;
        
        return {
          participant,
          totalScore,
          avgScore,
          categoryScores: participant.categories
        };
      });
      
      // Sort by average score (descending)
      participantsWithScores.sort((a, b) => b.avgScore - a.avgScore);
      
      // Add rankings
      participantsWithScores.forEach((item, index) => {
        item.ranking = index + 1;
      });
      
      resultsByAgeGroup[ageGroup] = participantsWithScores;
    });
    
    res.json({
      success: true,
      pageant: {
        id: pageant._id,
        name: pageant.name,
        organization: pageant.organization.name,
        categories: pageant.categories,
        ageGroups: pageant.ageGroups
      },
      resultsByAgeGroup
    });
  } catch (error) {
    console.error('Get pageant results error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   POST /api/scoring/pageant/:id/export
// @desc    Export pageant results
// @access  Private
exports.exportPageantResults = async (req, res) => {
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
        error: 'Not authorized to export this pageant\'s results'
      });
    }
    
    // For now, just return a success message
    // In a real implementation, you would generate a CSV/Excel file
    res.json({
      success: true,
      message: 'Export feature coming soon',
      downloadUrl: null // Would contain the URL to download the exported file
    });
  } catch (error) {
    console.error('Export pageant results error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
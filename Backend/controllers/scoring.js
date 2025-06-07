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
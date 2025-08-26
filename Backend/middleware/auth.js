// Backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - general authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No user found with this token'
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Protect routes - require specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Middleware to check if user owns a specific organization
const checkOrganizationOwnership = async (req, res, next) => {
  try {
    const Organization = require('../models/Organization');
    const organizationId = req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID is required'
      });
    }

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    if (organization.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this organization'
      });
    }

    req.organization = organization;
    next();
  } catch (error) {
    console.error('Organization ownership check error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Middleware to check if user owns the pageant through organization
const checkPageantOwnership = async (req, res, next) => {
  try {
    const Pageant = require('../models/Pageant');
    const pageantId = req.params.pageantId || req.body.pageantId;

    if (!pageantId) {
      return res.status(400).json({
        success: false,
        error: 'Pageant ID is required'
      });
    }

    const pageant = await Pageant.findById(pageantId)
      .populate('organization', 'owner');

    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    if (pageant.organization.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this pageant'
      });
    }

    req.pageant = pageant;
    next();
  } catch (error) {
    console.error('Pageant ownership check error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Middleware to check if user is contestant or pageant organizer
const checkParticipantAccess = async (req, res, next) => {
  try {
    const Participant = require('../models/Participant');
    const participantId = req.params.participantId || req.params.id;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'Participant ID is required'
      });
    }

    const participant = await Participant.findById(participantId)
      .populate({
        path: 'pageant',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    // Check if user is the participant or the pageant organizer
    const isOwner = participant.user.toString() === req.user.id;
    const isOrganizer = participant.pageant.organization.owner.toString() === req.user.id;

    if (!isOwner && !isOrganizer) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this participant data'
      });
    }

    req.participant = participant;
    req.isParticipantOwner = isOwner;
    req.isPageantOrganizer = isOrganizer;
    next();
  } catch (error) {
    console.error('Participant access check error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Optional authentication - sets user if token is valid but doesn't require it
const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in cookies first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without setting user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.id);
  } catch (error) {
    // If token is invalid, continue without setting user
    console.log('Invalid token in optional auth:', error.message);
  }

  next();
};

module.exports = {
  protect,
  authorize,
  checkOrganizationOwnership,
  checkPageantOwnership,
  checkParticipantAccess,
  optionalAuth
};
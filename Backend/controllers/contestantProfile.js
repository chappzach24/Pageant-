// Backend/controllers/contestantProfile.js
const ContestantProfile = require('../models/ContestantProfile');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get current contestant profile
exports.getProfile = async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await ContestantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      // If no profile exists, create a new one
      const newProfile = new ContestantProfile({
        user: req.user.id
      });
      
      await newProfile.save();
      return res.json({
        success: true,
        profile: newProfile
      });
    }
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error getting contestant profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update contestant profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      biography,
      funFact,
      hairColor,
      eyeColor,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      allergies,
      medicalConditions,
      proofOfAgeType
    } = req.body;

    // Find profile by user ID
    let profile = await ContestantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      // If no profile exists, create a new one
      profile = new ContestantProfile({
        user: req.user.id
      });
    }

    // Update fields
    if (biography !== undefined) profile.biography = biography;
    if (funFact !== undefined) profile.funFact = funFact;
    
    // Update appearance
    if (hairColor !== undefined) profile.appearance.hairColor = hairColor;
    if (eyeColor !== undefined) profile.appearance.eyeColor = eyeColor;
    
    // Update emergency contact
    if (emergencyContactName !== undefined) profile.emergencyContact.name = emergencyContactName;
    if (emergencyContactPhone !== undefined) profile.emergencyContact.phone = emergencyContactPhone;
    if (emergencyContactRelationship !== undefined) profile.emergencyContact.relationship = emergencyContactRelationship;
    
    // Update medical information
    if (allergies !== undefined) profile.medicalInformation.allergies = allergies;
    if (medicalConditions !== undefined) profile.medicalInformation.medicalConditions = medicalConditions;
    
    // Update document type
    if (proofOfAgeType !== undefined) profile.documents.proofOfAgeType = proofOfAgeType;

    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error updating contestant profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Upload proof of age document
exports.uploadProofOfAge = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Find profile by user ID
    let profile = await ContestantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      // If no profile exists, create a new one
      profile = new ContestantProfile({
        user: req.user.id
      });
    }

    // Check if there's an existing file to delete
    if (profile.documents.proofOfAgeFile && profile.documents.proofOfAgeFile.filename) {
      const filePath = path.join(__dirname, '../uploads', profile.documents.proofOfAgeFile.filename);
      
      // Delete file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Update document info
    profile.documents.proofOfAgeFile = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      uploadDate: new Date()
    };

    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error uploading proof of age:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get profile completeness
exports.getProfileCompleteness = async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await ContestantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.json({
        success: true,
        completeness: 0
      });
    }
    
    // Calculate completeness
    const completeness = profile.calculateCompleteness();
    
    res.json({
      success: true,
      completeness
    });
  } catch (error) {
    console.error('Error getting profile completeness:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get complete contestant info (user + profile)
exports.getCompleteContestantInfo = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Find or create profile
    let profile = await ContestantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      profile = new ContestantProfile({
        user: req.user.id
      });
      
      await profile.save();
    }
    
    res.json({
      success: true,
      contestant: {
        user,
        profile
      }
    });
  } catch (error) {
    console.error('Error getting complete contestant info:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
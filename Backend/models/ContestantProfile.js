// Backend/models/ContestantProfile.js
const mongoose = require('mongoose');

const ContestantProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  biography: {
    type: String,
    default: '',
    maxlength: 1000
  },
  funFact: {
    type: String,
    default: '',
    maxlength: 200
  },
  appearance: {
    hairColor: {
      type: String,
      default: ''
    },
    eyeColor: {
      type: String,
      default: ''
    }
  },
  emergencyContact: {
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    relationship: {
      type: String,
      default: ''
    }
  },
  medicalInformation: {
    allergies: {
      type: String,
      default: ''
    },
    medicalConditions: {
      type: String,
      default: ''
    }
  },
  documents: {
    proofOfAgeType: {
      type: String,
      enum: ['birth-certificate', 'id', 'passport', 'other'],
      default: 'birth-certificate'
    },
    proofOfAgeFile: {
      filename: String,
      originalName: String,
      mimeType: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to calculate profile completeness
ContestantProfileSchema.methods.calculateCompleteness = function() {
  let completenessScore = 0;
  const totalFields = 8; // Total sections to check
  
  // Check biography
  if (this.biography && this.biography.length > 0) completenessScore++;
  
  // Check appearance
  if (this.appearance.hairColor && this.appearance.eyeColor) completenessScore++;
  
  // Check emergency contact
  if (this.emergencyContact.name && this.emergencyContact.phone) completenessScore++;
  
  // Check medical information
  if (this.medicalInformation.allergies !== undefined) completenessScore++;
  if (this.medicalInformation.medicalConditions !== undefined) completenessScore++;
  
  // Check documents
  if (this.documents.proofOfAgeFile && this.documents.proofOfAgeFile.filename) completenessScore++;
  
  // Check fun fact
  if (this.funFact && this.funFact.length > 0) completenessScore++;
  
  // Convert to percentage
  this.profileCompleteness = Math.round((completenessScore / totalFields) * 100);
  return this.profileCompleteness;
};

// Pre-save hook to calculate completeness
ContestantProfileSchema.pre('save', function(next) {
  this.calculateCompleteness();
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('ContestantProfile', ContestantProfileSchema);
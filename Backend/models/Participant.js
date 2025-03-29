const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pageant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pageant',
    required: true
  },
  categories: [{
    category: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    notes: String
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  ageGroup: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'withdrawn', 'disqualified'],
    default: 'registered'
  },
  notes: String,
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only register once for a pageant
ParticipantSchema.index({ user: 1, pageant: 1 }, { unique: true });

module.exports = mongoose.model('Participant', ParticipantSchema);
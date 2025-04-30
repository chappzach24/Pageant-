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
  contestantProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContestantProfile',
    required: true
  },
  categories: [
    {
      category: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
        validate: {
          validator: function (v) {
            // Allow scores to be between 0 and 10 with up to 1 decimal place
            return v >= 0 && v <= 10 && Math.round(v * 10) / 10 === v;
          },
          message: (props) =>
            `${props.value} is not a valid score! Scores must be between 0 and 10 with up to 1 decimal place.`
        }
      },
      notes: String
    }
  ],
  photos: {
    faceImage: {
      filename: String,
      originalName: String,
      mimeType: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    fullBodyImage: {
      filename: String,
      originalName: String,
      mimeType: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  waiverAgreed: {
    type: Boolean,
    default: false
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
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentHistory: [
    {
      amount: Number,
      date: {
        type: Date,
        default: Date.now
      },
      transactionId: String,
      method: String
    }
  ]
}, {
  timestamps: true
});

// Compound index to ensure a user can only register once for a pageant
ParticipantSchema.index({ user: 1, pageant: 1 }, { unique: true });

module.exports = mongoose.model('Participant', ParticipantSchema);
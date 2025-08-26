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
  notes: {
    type: String,
    default: '',
    maxlength: 1000
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  // Enhanced payment information for Stripe integration
  stripeSessionId: {
    type: String,
    sparse: true // Allows multiple null values but unique non-null values
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  }],
  // Financial summary fields
  totalPaid: {
    type: Number,
    default: 0
  },
  totalRefunded: {
    type: Number,
    default: 0
  },
  balanceDue: {
    type: Number,
    default: 0
  },
  // Application tracking fields
  applicationReviewedAt: {
    type: Date
  },
  applicationReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    maxlength: 500
  },
  approvalDate: {
    type: Date
  },
  // Communication tracking
  lastContactDate: {
    type: Date
  },
  communicationNotes: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'message', 'note'],
      default: 'note'
    },
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure a user can only register once for a pageant
ParticipantSchema.index({ user: 1, pageant: 1 }, { unique: true });

// Index for efficient payment queries
ParticipantSchema.index({ stripeSessionId: 1 });
ParticipantSchema.index({ stripePaymentIntentId: 1 });
ParticipantSchema.index({ paymentStatus: 1 });

// Index for application management
ParticipantSchema.index({ status: 1 });
ParticipantSchema.index({ registrationDate: -1 });
ParticipantSchema.index({ pageant: 1, status: 1 });

// Virtual for the latest payment
ParticipantSchema.virtual('latestPayment').get(function() {
  if (this.paymentHistory && this.paymentHistory.length > 0) {
    return this.paymentHistory[this.paymentHistory.length - 1];
  }
  return null;
});

// Virtual to check if application is pending
ParticipantSchema.virtual('isPending').get(function() {
  return this.status === 'registered';
});

// Virtual to check if application is approved
ParticipantSchema.virtual('isApproved').get(function() {
  return this.status === 'confirmed';
});

// Virtual to check if application is rejected
ParticipantSchema.virtual('isRejected').get(function() {
  return this.status === 'disqualified';
});

// Method to approve application
ParticipantSchema.methods.approve = function(reviewedBy, notes) {
  this.status = 'confirmed';
  this.applicationReviewedAt = new Date();
  this.applicationReviewedBy = reviewedBy;
  this.approvalDate = new Date();
  if (notes) {
    this.notes = notes;
  }
  return this.save();
};

// Method to reject application
ParticipantSchema.methods.reject = function(reviewedBy, reason, notes) {
  this.status = 'disqualified';
  this.applicationReviewedAt = new Date();
  this.applicationReviewedBy = reviewedBy;
  this.rejectionReason = reason;
  if (notes) {
    this.notes = notes;
  }
  return this.save();
};

// Method to add communication note
ParticipantSchema.methods.addCommunicationNote = function(type, content, createdBy) {
  this.communicationNotes.push({
    type,
    content,
    createdBy,
    date: new Date()
  });
  this.lastContactDate = new Date();
  return this.save();
};

// Method to get payment summary
ParticipantSchema.methods.getPaymentSummary = function() {
  return {
    totalAmount: this.paymentAmount,
    totalPaid: this.totalPaid,
    totalRefunded: this.totalRefunded,
    balanceDue: this.balanceDue,
    paymentStatus: this.paymentStatus,
    paymentCount: this.paymentHistory.length,
    latestPayment: this.latestPayment
  };
};

// Static method to get application statistics for a pageant
ParticipantSchema.statics.getApplicationStats = async function(pageantId) {
  const stats = await this.aggregate([
    { $match: { pageant: mongoose.Types.ObjectId(pageantId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    registered: 0,
    confirmed: 0,
    withdrawn: 0,
    disqualified: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Static method to get pending applications count for an organization
ParticipantSchema.statics.getPendingApplicationsCount = async function(organizationId) {
  const Pageant = mongoose.model('Pageant');
  
  const pageants = await Pageant.find({ organization: organizationId }).select('_id');
  const pageantIds = pageants.map(p => p._id);
  
  return await this.countDocuments({
    pageant: { $in: pageantIds },
    status: 'registered'
  });
};

// Pre-save middleware to update timestamps and validation
ParticipantSchema.pre('save', function(next) {
  // Update review timestamp when status changes
  if (this.isModified('status') && this.status !== 'registered') {
    if (!this.applicationReviewedAt) {
      this.applicationReviewedAt = new Date();
    }
  }
  
  // Set approval date when approved
  if (this.isModified('status') && this.status === 'confirmed' && !this.approvalDate) {
    this.approvalDate = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Participant', ParticipantSchema);
// Backend/models/Participant.js
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
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only register once for a pageant
ParticipantSchema.index({ user: 1, pageant: 1 }, { unique: true });

// Index for efficient payment queries
ParticipantSchema.index({ stripeSessionId: 1 });
ParticipantSchema.index({ stripePaymentIntentId: 1 });
ParticipantSchema.index({ paymentStatus: 1 });

// Virtual for the latest payment
ParticipantSchema.virtual('latestPayment').get(function() {
  if (this.paymentHistory && this.paymentHistory.length > 0) {
    return this.paymentHistory[this.paymentHistory.length - 1];
  }
  return null;
});

// Method to add a payment record
ParticipantSchema.methods.addPayment = function(paymentData) {
  const {
    amount,
    transactionId,
    method = 'stripe',
    status = 'completed',
    stripeSessionId,
    stripePaymentIntentId,
    description,
    metadata = {}
  } = paymentData;

  const payment = {
    amount,
    transactionId,
    method,
    status,
    stripeSessionId,
    stripePaymentIntentId,
    description,
    metadata,
    date: new Date()
  };

  this.paymentHistory.push(payment);
  this.updatePaymentSummary();
  return payment;
};

// Method to update payment summary fields
// ParticipantSchema.methods.updatePaymentSummary = function() {
//   const completedPayments = this.paymentHistory.filter(p => p.status === 'completed');
//   const refundedPayments = this.paymentHistory.filter(p => p.status === 'refunded');
  
//   this.totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
//   this.totalRefunded = refundedPayments.reduce((sum, p) => sum + p.amount, 0);
  
//   // Update payment status based on total paid vs payment amount
//   if (this.totalPaid >= this.paymentAmount) {
//     this.paymentStatus = 'completed';
//     this.balanceDue = 0;
//   } else if (this.totalPaid > 0) {
//     this.paymentStatus = 'partial';
//     this.balanceDue = this.paymentAmount - this.totalPaid;
//   } else {
//     this.paymentStatus = 'pending';
//     this.balanceDue = this.paymentAmount;
//   }
// };

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

// Pre-save middleware to update payment summary
// ParticipantSchema.pre('save', function(next) {
//   if (this.isModified('paymentHistory') || this.isModified('paymentAmount')) {
//     this.updatePaymentSummary();
//   }
//   next();
// });

module.exports = mongoose.model('Participant', ParticipantSchema);
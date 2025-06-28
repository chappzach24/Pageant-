// Backend/models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
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
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  method: {
    type: String,
    enum: ['stripe', 'cash', 'check', 'bank_transfer', 'other'],
    default: 'stripe'
  },
  transactionId: {
    type: String,
    required: true
  },
  stripeSessionId: {
    type: String,
    sparse: true
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
PaymentSchema.index({ participant: 1 });
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ pageant: 1 });
PaymentSchema.index({ stripeSessionId: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
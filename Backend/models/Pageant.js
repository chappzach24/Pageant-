const mongoose = require('mongoose');

// Define allowed age groups as a constant
const AGE_GROUPS = ['5 - 8 Years', '9 - 12 Years', '13 - 18 Years', '19 - 39 Years', '40+ Years'];

const PageantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pageant name is required'],
    trim: true
  },
  //  New field for a pageant ID
  pageantID: {
    type: String,
    required: [true, "Pageant ID is required"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  competitionYear: {
    type: Number,
    required: [true, 'Competition year is required'],
    validate: {
      validator: function(v) {
        return v >= new Date().getFullYear();
      },
      message: props => `${props.value} is not a valid competition year! Must be current year or future.`
    }
  },
  location: {
    venue: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    virtual: Boolean
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  entryFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  ageGroups: {
    type: [{
      type: String,
      enum: AGE_GROUPS
    }],
    required: [true, 'At least one age group is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one age group must be selected'
    }
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    scoringCriteria: [{
      name: String,
      description: String,
      maxScore: Number
    }]
  }],
  prizes: [{
    title: String,
    description: String,
    value: Number,
    forAgeGroup: {
      type: String,
      enum: [...AGE_GROUPS, 'All']
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'registration-closed', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  coverImage: {
    type: String,
    default: 'default-pageant-cover.jpg'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // New field to reference contestants
  contestants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContestantProfile'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
PageantSchema.virtual('participantCount', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'pageant',
  count: true
});

// Check if registration is open
PageantSchema.virtual('registrationOpen').get(function() {
  const now = new Date();
  return this.status === 'published' && 
         now < this.registrationDeadline && 
         (this.maxParticipants === 0 || this.participantCount < this.maxParticipants);
});

// Method to check if dates are valid
PageantSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  if (this.registrationDeadline && this.startDate && this.registrationDeadline > this.startDate) {
    this.invalidate('registrationDeadline', 'Registration deadline must be before start date');
  }
  next();
});

module.exports = mongoose.model('Pageant', PageantSchema);
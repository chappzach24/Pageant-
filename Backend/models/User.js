const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for age calculation
UserSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for age group based on January 1st
UserSchema.virtual('ageGroup').get(function() {
  const year = new Date().getFullYear();
  const januaryFirst = new Date(year, 0, 1);
  const birthDate = new Date(this.dateOfBirth);
  
  let age = januaryFirst.getFullYear() - birthDate.getFullYear();
  
  if (birthDate.getMonth() > 0 || birthDate.getDate() > 1) {
    age--; // Adjust if birthday hasn't occurred yet by January 1st
  }
  
  if (age >= 5 && age <= 8) return '5 - 8 Years';
  else if (age >= 9 && age <= 12) return '9 - 12 Years';
  else if (age >= 13 && age <= 18) return '13 - 18 Years';
  else if (age >= 19 && age <= 39) return '19 - 39 Years';
  else if (age >= 40) return '40+ Years';
  return 'Not Eligible';
});

// Password hash middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
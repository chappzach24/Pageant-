export const validateRegistrationForm = (formData) => {
  const errors = [];

  if (!formData.name?.trim()) {
    errors.push('Pageant name is required');
  }

  if (!formData.startDate) {
    errors.push('Start date is required');
  }

  if (!formData.endDate) {
    errors.push('End date is required');
  }

  if (!formData.registrationDeadline) {
    errors.push('Registration deadline is required');
  }

  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }

  if (formData.registrationDeadline && formData.startDate) {
    const deadline = new Date(formData.registrationDeadline);
    const startDate = new Date(formData.startDate);
    
    if (deadline >= startDate) {
      errors.push('Registration deadline must be before start date');
    }
  }

  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};
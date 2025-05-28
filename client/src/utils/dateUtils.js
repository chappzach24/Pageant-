export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

export const getDaysRemaining = (deadlineDate) => {
  if (!deadlineDate) return 0;
  
  const today = new Date();
  const deadline = new Date(deadlineDate);
  
  // Calculate difference in days
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

export const getDaysUntil = (startDate) => {
  const today = new Date();
  const pageantDate = new Date(startDate);
  
  // Calculate difference in days
  const diffTime = pageantDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getPageantStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (today < start) {
    return 'upcoming';
  } else if (today >= start && today <= end) {
    return 'in-progress';
  } else {
    return 'completed';
  }
};
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency with proper symbol
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  
  return formatDate(dateString);
};

// Prepare pageant data for modal display
export const preparePageantForModal = (pageant) => {
  if (!pageant) return null;
  
  // Clean up the pageant object to remove any circular references
  // or problematic data that might cause issues in the modal
  return {
    _id: pageant._id,
    name: pageant.name,
    description: pageant.description,
    startDate: pageant.startDate,
    endDate: pageant.endDate,
    registrationDeadline: pageant.registrationDeadline,
    location: pageant.location,
    entryFee: pageant.entryFee,
    categories: pageant.categories || [],
    ageGroups: pageant.ageGroups || [],
    status: pageant.status,
    maxParticipants: pageant.maxParticipants,
    organization: pageant.organization,
    overallPlacement: pageant.overallPlacement
  };
};

// Get status badge configuration
export const getStatusBadgeConfig = (status) => {
  const statusConfig = {
    pending: { 
      bg: 'bg-warning text-dark', 
      text: 'Pending' 
    },
    approved: { 
      bg: 'bg-success', 
      text: 'Approved' 
    },
    rejected: { 
      bg: 'bg-danger', 
      text: 'Rejected' 
    },
    completed: { 
      bg: 'bg-info', 
      text: 'Completed' 
    },
    active: { 
      bg: 'bg-primary', 
      text: 'Active' 
    },
    draft: { 
      bg: 'bg-secondary', 
      text: 'Draft' 
    },
    published: { 
      bg: 'bg-success', 
      text: 'Published' 
    },
    cancelled: { 
      bg: 'bg-danger', 
      text: 'Cancelled' 
    }
  };
  
  return statusConfig[status] || statusConfig.pending;
};

// Calculate days until deadline
export const calculateDaysUntilDeadline = (deadlineDate) => {
  if (!deadlineDate) return null;
  
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get urgency level based on days until deadline
export const getUrgencyLevel = (daysUntil) => {
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 3) return 'critical';
  if (daysUntil <= 7) return 'urgent';
  if (daysUntil <= 30) return 'moderate';
  return 'normal';
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber; // Return original if not 10 digits
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate initials from name
export const generateInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return 'U';
  
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return first + last || first || last;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Deep clone object (for state management)
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Sort array by multiple criteria
export const multiSort = (array, sortCriteria) => {
  return array.sort((a, b) => {
    for (const criteria of sortCriteria) {
      const { key, direction = 'asc' } = criteria;
      let aVal = a[key];
      let bVal = b[key];
      
      // Handle nested object properties
      if (key.includes('.')) {
        const keys = key.split('.');
        aVal = keys.reduce((obj, k) => obj?.[k], a);
        bVal = keys.reduce((obj, k) => obj?.[k], b);
      }
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) continue;
      if (aVal == null) return direction === 'asc' ? 1 : -1;
      if (bVal == null) return direction === 'asc' ? -1 : 1;
      
      // Compare values
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
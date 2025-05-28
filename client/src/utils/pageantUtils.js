export const getOrganizationName = (organization) => {
  if (!organization) return 'Unknown Organization';
  
  if (typeof organization === 'string') return organization;
  if (typeof organization === 'object' && organization.name) return organization.name;
  if (typeof organization === 'object' && organization._id && typeof organization._id === 'object' && organization._id.name) {
    return organization._id.name;
  }
  
  return 'Unknown Organization';
};

export const getLocationString = (location) => {
  if (!location) return 'Online';
  
  let locationStr = location.venue || '';
  
  if (location.address) {
    if (locationStr) locationStr += ', ';
    
    if (location.address.city) {
      locationStr += location.address.city;
    }
    
    if (location.address.state) {
      if (location.address.city) locationStr += ', ';
      locationStr += location.address.state;
    }
  }
  
  return locationStr || 'Online';
};

export const preparePageantForModal = (pageant) => {
  // Defensive check
  if (!pageant) return null;
  
  // Create a clean object with proper values
  return {
    _id: pageant._id || '',
    name: pageant.name || 'Untitled Pageant',
    organization: getOrganizationName(pageant.organization),
    description: pageant.description || '',
    startDate: pageant.startDate || '',
    endDate: pageant.endDate || '',
    location: {
      venue: pageant.location?.venue || '',
      address: {
        city: pageant.location?.address?.city || '',
        state: pageant.location?.address?.state || ''
      }
    },
    status: pageant.status || '',
    registrationDeadline: pageant.registrationDeadline || '',
    entryFee: pageant.entryFee 
      ? {
          amount: pageant.entryFee.amount || 0,
          currency: pageant.entryFee.currency || 'USD'
        }
      : {
          amount: 0,
          currency: 'USD'
        },
    ageGroups: Array.isArray(pageant.ageGroups) ? pageant.ageGroups : [],
    categories: Array.isArray(pageant.categories) 
      ? pageant.categories.map(cat => {
          if (typeof cat === 'string') {
            return { category: cat };
          } else if (typeof cat === 'object') {
            return {
              category: cat.category || cat.name || 'Unknown Category',
              score: cat.score || null,
              placement: cat.placement || null
            };
          }
          return { category: 'Unknown Category' };
        }) 
      : [],
    overallPlacement: pageant.overallPlacement || null,
    competitionYear: pageant.competitionYear || new Date().getFullYear()
  };
};
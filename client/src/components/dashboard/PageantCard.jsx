// client/src/pages/dashboard/PageantCard.jsx
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faLocationDot, 
  faEye,
  faMedal
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PageantCard = ({ 
  pageant, 
  type = 'active', // 'active' or 'past'
  showCategories = true,
  showResults = false,
  className = '',
  renderActions = null // New prop for custom action renderer
}) => {
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get location string
  const getLocationString = (location) => {
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

  // Calculate days until pageant
  const calculateDaysUntil = (startDate) => {
    const today = new Date();
    const pageantDate = new Date(startDate);
    
    // If the pageant has already started
    if (pageantDate <= today) {
      const endDate = new Date(pageant.endDate);
      
      // If pageant is ongoing
      if (endDate >= today) {
        return { text: 'In Progress', class: 'in-progress' };
      }
      
      // If pageant has ended
      return { text: 'Completed', class: 'completed' };
    }
    
    // Calculate days until pageant
    const diffTime = Math.abs(pageantDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { 
      text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, 
      class: diffDays <= 7 ? 'coming-soon' : 'upcoming' 
    };
  };

  // Get placement badge (for past pageants)
  const getPlacementBadge = (placement) => {
    if (!placement) return null;
    
    let badgeClass = '';
    let badgeText = '';
    
    switch (placement) {
      case 1:
        badgeClass = 'badge-gold';
        badgeText = '1st Place';
        break;
      case 2:
        badgeClass = 'badge-silver';
        badgeText = '2nd Place';
        break;
      case 3:
        badgeClass = 'badge-bronze';
        badgeText = '3rd Place';
        break;
      default:
        badgeClass = 'badge-participation';
        badgeText = `${placement}th Place`;
    }
    
    return (
      <span className={`placement-badge ${badgeClass}`}>
        <FontAwesomeIcon icon={faMedal} className="me-1" />
        {badgeText}
      </span>
    );
  };

  // Get color for placement
  const getPlacementColor = (placement) => {
    if (!placement) return 'text-muted';
    
    switch (placement) {
      case 1: return 'text-gold';
      case 2: return 'text-silver';
      case 3: return 'text-bronze';
      default: return 'text-muted';
    }
  };

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    if (!num) return '';
    
    const j = num % 10,
          k = num % 100;
          
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };

  // Get organization name, handling deeply nested objects
  const getOrganizationName = () => {
    if (!pageant.organization) return 'Unknown Organization';
    
    // Log the organization data type and structure to help with debugging
    console.log('Organization data:', pageant.organization);
    
    // Case 1: Organization is a string
    if (typeof pageant.organization === 'string') {
      return pageant.organization;
    }
    
    // Case 2: Organization is an object with a name property
    if (typeof pageant.organization === 'object') {
      // Direct name property
      if (pageant.organization.name) {
        return pageant.organization.name;
      }
      
      // _id may be an object with name
      if (pageant.organization._id && typeof pageant.organization._id === 'object' && pageant.organization._id.name) {
        return pageant.organization._id.name;
      }
    }
    
    // Case 3: Fall back to string representation or default
    return String(pageant.organization).substring(0, 24) || 'Unknown Organization';
  };

  // Get card type specific elements
  const getCardHeader = () => {
    if (type === 'active') {
      const daysUntil = calculateDaysUntil(pageant.startDate);
      
      return (
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{pageant.name}</h5>
          <span className={`days-until badge ${daysUntil.class === 'in-progress' ? 'bg-success' : daysUntil.class === 'coming-soon' ? 'bg-warning text-dark' : daysUntil.class === 'completed' ? 'bg-secondary' : 'bg-primary'}`}>
            {daysUntil.text}
          </span>
        </div>
      );
    } else if (type === 'past') {
      return (
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{pageant.name}</h5>
          {pageant.overallPlacement && getPlacementBadge(pageant.overallPlacement)}
        </div>
      );
    }
  };

  return (
    <div className={`card h-100 shadow-sm pageant-card ${type}-pageant-card ${className}`}>
      {getCardHeader()}
      
      <div className="card-body d-flex flex-column">
        <div className="pageant-info">
          <div className="info-section">
            <div className="info-label">Organization</div>
            <div className="info-value">{getOrganizationName()}</div>
          </div>
          
          <div className="info-section">
            <div className="info-label">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Dates
            </div>
            <div className="info-value">{formatDate(pageant.startDate)} - {formatDate(pageant.endDate)}</div>
          </div>
          
          <div className="info-section">
            <div className="info-label">
              <FontAwesomeIcon icon={faLocationDot} className="me-2" />Location
            </div>
            <div className="info-value">{getLocationString(pageant.location)}</div>
          </div>
        </div>
        
        {/* Categories List - For Active Pageants */}
        {showCategories && type === 'active' && pageant.categories && pageant.categories.length > 0 && (
          <div className="categories-section">
            <div className="info-label">Your Categories</div>
            <div className="categories-list">
              {pageant.categories.map((cat, idx) => (
                <span key={idx} className="category-badge">
                  {typeof cat === 'string' ? cat : cat.category}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Results Table - For Past Pageants */}
        {showResults && type === 'past' && pageant.categories && pageant.categories.length > 0 && (
          <div className="results-section">
            <div className="info-label">Your Performance</div>
            <div className="results-table">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-center">Place</th>
                    <th className="text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {pageant.categories.map((cat, idx) => (
                    <tr key={idx}>
                      <td>{typeof cat === 'string' ? cat : cat.category}</td>
                      <td className={`text-center ${getPlacementColor(cat.placement)}`}>
                        {cat.placement ? `${cat.placement}${getOrdinalSuffix(cat.placement)}` : '--'}
                      </td>
                      <td className="text-center">{cat.score ? cat.score.toFixed(1) : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="button-section mt-auto">
          {/* If custom renderer is provided, use it, otherwise use default Link */}
          {renderActions ? (
            renderActions()
          ) : (
            <Link 
              to={`/contestant-dashboard/${type === 'past' ? 'past-pageant' : 'pageant'}/${pageant._id}`} 
              className="btn btn-outline-primary w-100"
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

PageantCard.propTypes = {
  pageant: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['active', 'past']),
  showCategories: PropTypes.bool,
  showResults: PropTypes.bool,
  className: PropTypes.string,
  renderActions: PropTypes.func
};

export default PageantCard;
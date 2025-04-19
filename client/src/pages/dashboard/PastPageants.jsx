// Calculate longest streak of top-3 placements
const calculateLongestStreak = (pageants) => {
  if (!pageants.length) return 0;
  
  // Sort pageants by date (oldest to newest)
  const sortedPageants = [...pageants].sort((a, b) => 
    new Date(a.pageant.startDate) - new Date(b.pageant.startDate)
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  
  for (const pageant of sortedPageants) {
    if (pageant.overallPlacement && pageant.overallPlacement <= 3) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
};// client/src/pages/dashboard/PastPageants.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
faTrophy, 
faCalendarAlt, 
faLocationDot, 
faExclamationTriangle, 
faFilter,
faSearch,
faEye,
faMedal,
faHistory,
faSort,
faFire
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import '../../css/pastPageants.css';

const PastPageants = () => {
const { user } = useAuth();
const [pageants, setPageants] = useState([]);
const [filteredPageants, setFilteredPageants] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterYear, setFilterYear] = useState('all');
const [sortOption, setSortOption] = useState('newest'); // newest, oldest, placement

// Mock data for frontend development
const mockPageants = [
  {
    _id: '1',
    pageant: {
      _id: 'p1',
      name: 'Spring Classic Pageant',
      organization: 'Golden Crown Productions',
      startDate: '2024-03-15T00:00:00.000Z',
      endDate: '2024-03-17T00:00:00.000Z',
      location: {
        venue: 'Grand Hotel Ballroom',
        address: {
          city: 'Atlanta',
          state: 'GA'
        }
      },
      status: 'completed',
      year: 2024
    },
    registrationDate: '2024-01-10T00:00:00.000Z',
    categories: [
      { category: 'Evening Gown', placement: 1, score: 9.8 },
      { category: 'Talent', placement: 3, score: 8.7 },
      { category: 'Interview', placement: 2, score: 9.2 }
    ],
    status: 'completed',
    overallPlacement: 2
  },
  {
    _id: '2',
    pageant: {
      _id: 'p2',
      name: 'Winter Wonderland Pageant',
      organization: 'Northern Lights Productions',
      startDate: '2023-12-10T00:00:00.000Z',
      endDate: '2023-12-12T00:00:00.000Z',
      location: {
        venue: 'Crystal Palace',
        address: {
          city: 'Chicago',
          state: 'IL'
        }
      },
      status: 'completed',
      year: 2023
    },
    registrationDate: '2023-10-20T00:00:00.000Z',
    categories: [
      { category: 'Formal Wear', placement: 5, score: 8.2 },
      { category: 'Winter Theme Costume', placement: 1, score: 9.9 },
      { category: 'Question and Answer', placement: 3, score: 8.8 }
    ],
    status: 'completed',
    overallPlacement: 3
  },
  {
    _id: '3',
    pageant: {
      _id: 'p3',
      name: 'National Junior Superstar',
      organization: 'Starlight Events',
      startDate: '2023-08-15T00:00:00.000Z',
      endDate: '2023-08-17T00:00:00.000Z',
      location: {
        venue: 'Grand Ballroom',
        address: {
          city: 'Dallas',
          state: 'TX'
        }
      },
      status: 'completed',
      year: 2023
    },
    registrationDate: '2023-06-15T00:00:00.000Z',
    categories: [
      { category: 'Casual Wear', placement: 1, score: 9.7 },
      { category: 'Talent Showcase', placement: 1, score: 9.8 },
      { category: 'Personality Interview', placement: 2, score: 9.5 }
    ],
    status: 'completed',
    overallPlacement: 1
  },
  {
    _id: '4',
    pageant: {
      _id: 'p4',
      name: 'Summer Elegance',
      organization: 'Coastal Pageants Inc.',
      startDate: '2022-06-20T00:00:00.000Z',
      endDate: '2022-06-25T00:00:00.000Z',
      location: {
        venue: 'Oceanview Convention Center',
        address: {
          city: 'Miami',
          state: 'FL'
        }
      },
      status: 'completed',
      year: 2022
    },
    registrationDate: '2022-04-10T00:00:00.000Z',
    categories: [
      { category: 'Swimwear', placement: 4, score: 8.5 },
      { category: 'Evening Gown', placement: 2, score: 9.3 },
      { category: 'On-Stage Question', placement: 5, score: 8.2 }
    ],
    status: 'completed',
    overallPlacement: 4
  }
];

// Get unique years for filter dropdown
const getUniqueYears = () => {
  if (pageants.length === 0) return [];
  
  const years = pageants.map(p => p.pageant.year);
  return [...new Set(years)].sort((a, b) => b - a); // Sort descending
};

useEffect(() => {
  // In a real implementation, this would be an API call to fetch the user's past pageants
  const fetchPageants = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setPageants(mockPageants);
        setFilteredPageants(mockPageants);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching past pageants:', err);
      setError('Failed to load your past pageants. Please try again later.');
      setIsLoading(false);
    }
  };

  if (user) {
    fetchPageants();
  }
}, [user]);

useEffect(() => {
  // Filter and sort pageants
  if (pageants.length) {
    let filtered = [...pageants];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.pageant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pageant.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.pageant.location?.venue && p.pageant.location.venue.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by year
    if (filterYear !== 'all') {
      filtered = filtered.filter(p => p.pageant.year === parseInt(filterYear));
    }
    
    // Sort pageants
    if (sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.pageant.endDate) - new Date(a.pageant.endDate));
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.pageant.endDate) - new Date(b.pageant.endDate));
    } else if (sortOption === 'placement') {
      filtered.sort((a, b) => (a.overallPlacement || 999) - (b.overallPlacement || 999));
    }
    
    setFilteredPageants(filtered);
  }
}, [pageants, searchTerm, filterYear, sortOption]);

// Format date to a readable format
const formatDate = (dateString) => {
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

// Get badge text for overall placement
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

return (
  <div className="past-pageants-container">
    <div className="page-header mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h2 className="u-text-dark mb-1">Past Pageants</h2>
        <p className="u-text-dark">View your pageant history and achievements</p>
      </div>
      <div className="d-flex">
        {/* This could be a button to download pageant history, generate reports, etc. */}
        <Link to="/contestant-dashboard/join-pageant" className="btn btn-outline-primary ms-2">
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Join New Pageant
        </Link>
      </div>
    </div>

    {/* Search, Filter, and Sort */}
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search past pageants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faFilter} />
              </span>
              <select
                className="form-select"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSort} />
              </span>
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="placement">Best Placement</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Summary */}
    <div className="stats-summary card mb-4">
      <div className="card-body">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faHistory} />
              </div>
              <div className="stat-value">{pageants.length}</div>
              <div className="stat-label">Total Pageants</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-item">
              <div className="stat-icon gold">
                <FontAwesomeIcon icon={faMedal} />
              </div>
              <div className="stat-value">
                {pageants.filter(p => p.overallPlacement === 1).length}
              </div>
              <div className="stat-label">First Place Wins</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div className="stat-value">
                {pageants.filter(p => p.overallPlacement <= 3).length}
              </div>
              <div className="stat-label">Podium Finishes</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-item">
              <div className="stat-icon flame">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <div className="stat-value">
                {calculateLongestStreak(pageants)}
              </div>
              <div className="stat-label">Longest Top-3 Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {isLoading ? (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : error ? (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    ) : filteredPageants.length === 0 ? (
      <div className="alert alert-info" role="alert">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        No past pageants found matching your criteria. Try adjusting your search or filter.
      </div>
    ) : (
      <div className="pageants-grid">
        <div className="row g-4">
          {filteredPageants.map((participation) => (
            <div className="col-md-6 col-lg-4" key={participation._id}>
              <div className="card past-pageant-card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{participation.pageant.name}</h5>
                  {getPlacementBadge(participation.overallPlacement)}
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="pageant-info">
                    <div className="info-section">
                      <div className="info-label">Organization</div>
                      <div className="info-value">{participation.pageant.organization}</div>
                    </div>
                    
                    <div className="info-section">
                      <div className="info-label">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Dates
                      </div>
                      <div className="info-value">{formatDate(participation.pageant.startDate)} - {formatDate(participation.pageant.endDate)}</div>
                    </div>
                    
                    <div className="info-section">
                      <div className="info-label">
                        <FontAwesomeIcon icon={faLocationDot} className="me-2" />Location
                      </div>
                      <div className="info-value">{getLocationString(participation.pageant.location)}</div>
                    </div>
                  </div>
                  
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
                          {participation.categories.map((cat, idx) => (
                            <tr key={idx}>
                              <td>{cat.category}</td>
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
                  
                  <div className="button-section">
                    <Link to={`/contestant-dashboard/past-pageant/${participation.pageant._id}`} className="btn btn-outline-primary w-100">
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num) {
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
}

export default PastPageants;
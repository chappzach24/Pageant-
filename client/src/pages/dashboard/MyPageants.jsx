// client/src/pages/dashboard/ActivePageants.jsx
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
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const MyPageants = () => {
  const { user } = useAuth();
  const [pageants, setPageants] = useState([]);
  const [filteredPageants, setFilteredPageants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, in-progress

  // Mock data for frontend development
  const mockPageants = [
    {
      _id: '1',
      pageant: {
        _id: 'p1',
        name: 'Summer Elegance 2025',
        organization: 'Coastal Pageants Inc.',
        startDate: '2025-06-15T00:00:00.000Z',
        endDate: '2025-06-20T00:00:00.000Z',
        location: {
          venue: 'Oceanview Convention Center',
          address: {
            city: 'Miami',
            state: 'FL'
          }
        },
        status: 'published'
      },
      registrationDate: '2025-04-10T00:00:00.000Z',
      categories: [
        { category: 'Evening Gown' },
        { category: 'Talent' },
        { category: 'Interview' }
      ],
      status: 'registered'
    },
    {
      _id: '2',
      pageant: {
        _id: 'p2',
        name: 'Winter Wonderland Pageant',
        organization: 'Northern Lights Productions',
        startDate: '2025-05-05T00:00:00.000Z', // Closer date for testing
        endDate: '2025-05-07T00:00:00.000Z',
        location: {
          venue: 'Crystal Palace',
          address: {
            city: 'Chicago',
            state: 'IL'
          }
        },
        status: 'published'
      },
      registrationDate: '2025-03-20T00:00:00.000Z',
      categories: [
        { category: 'Formal Wear' },
        { category: 'Winter Theme Costume' },
        { category: 'Question and Answer' }
      ],
      status: 'confirmed'
    },
    {
      _id: '3',
      pageant: {
        _id: 'p3',
        name: 'National Junior Superstar',
        organization: 'Starlight Events',
        startDate: '2025-04-26T00:00:00.000Z', // Very close date for testing
        endDate: '2025-04-28T00:00:00.000Z',
        location: {
          venue: 'Grand Ballroom',
          address: {
            city: 'Dallas',
            state: 'TX'
          }
        },
        status: 'in-progress'
      },
      registrationDate: '2025-02-15T00:00:00.000Z',
      categories: [
        { category: 'Casual Wear' },
        { category: 'Talent Showcase' },
        { category: 'Personality Interview' }
      ],
      status: 'confirmed'
    },
    {
      _id: '4',
      pageant: {
        _id: 'p4',
        name: 'Spring Blossom Pageant',
        organization: 'Garden Events',
        startDate: '2025-04-19T00:00:00.000Z', // Use today's date to show in-progress
        endDate: '2025-04-21T00:00:00.000Z',
        location: {
          venue: 'Botanical Gardens',
          address: {
            city: 'Portland',
            state: 'OR'
          }
        },
        status: 'in-progress'
      },
      registrationDate: '2025-03-01T00:00:00.000Z',
      categories: [
        { category: 'Floral Couture' },
        { category: 'Nature Talent' },
        { category: 'Environmental Q&A' }
      ],
      status: 'confirmed'
    }
  ];

  useEffect(() => {
    // In a real implementation, this would be an API call to fetch the user's pageants
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
        console.error('Error fetching pageants:', err);
        setError('Failed to load your pageants. Please try again later.');
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPageants();
    }
  }, [user]);

  useEffect(() => {
    // Filter pageants based on search term and status
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
      
      // Filter by status
      const today = new Date();
      if (filterStatus === 'upcoming') {
        filtered = filtered.filter(p => new Date(p.pageant.startDate) > today);
      } else if (filterStatus === 'in-progress') {
        filtered = filtered.filter(p => {
          const startDate = new Date(p.pageant.startDate);
          const endDate = new Date(p.pageant.endDate);
          return startDate <= today && endDate >= today;
        });
      }
      
      // Sort by closest start date to farthest
      filtered.sort((a, b) => {
        const dateA = new Date(a.pageant.startDate);
        const dateB = new Date(b.pageant.startDate);
        return dateA - dateB;
      });
      
      setFilteredPageants(filtered);
    }
  }, [pageants, searchTerm, filterStatus]);

  // Function to calculate days until pageant
  const calculateDaysUntil = (startDate) => {
    const today = new Date();
    const pageantDate = new Date(startDate);
    
    // If the pageant has already started
    if (pageantDate <= today) {
      const endDate = new Date(pageantDate);
      endDate.setDate(endDate.getDate() + 5); // Assuming a 5-day pageant if not provided
      
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

  return (
    <div className="active-pageants-container">
      <div className="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="u-text-dark mb-1">Active Pageants</h2>
          <p className="u-text-dark">View all your registered pageants</p>
        </div>
        <Link to="/contestant-dashboard/join-pageant" className="btn btn-primary">
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Join New Pageant
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search pageants by name, organization, or location"
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Pageants</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                </select>
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
          No pageants found matching your criteria. Try adjusting your search or filter.
        </div>
      ) : (
        <div className="pageants-grid">
          <div className="row g-4">
            {filteredPageants.map((participation) => {
              const daysUntil = calculateDaysUntil(participation.pageant.startDate);
              
              return (
                <div className="col-md-6 col-lg-4" key={participation._id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">{participation.pageant.name}</h5>
                      <span className={`days-until badge ${daysUntil.class === 'in-progress' ? 'bg-success' : daysUntil.class === 'coming-soon' ? 'bg-warning text-dark' : daysUntil.class === 'completed' ? 'bg-secondary' : 'bg-primary'}`}>
                        {daysUntil.text}
                      </span>
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
                      
                      <div className="categories-section">
                        <div className="info-label">Your Categories</div>
                        <div className="categories-list">
                          {participation.categories.map((cat, idx) => (
                            <span key={idx} className="category-badge">
                              {cat.category}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="button-section">
                        <Link to={`/contestant-dashboard/pageant/${participation.pageant._id}`} className="btn btn-outline-primary w-100">
                          <FontAwesomeIcon icon={faEye} className="me-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageants;
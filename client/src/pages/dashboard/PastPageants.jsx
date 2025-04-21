// client/src/pages/dashboard/PastPageants.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faExclamationTriangle, 
  faFilter,
  faSearch,
  faHistory,
  faSort,
  faFire,
  faMedal,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import PageantCard from './PageantCard';
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import '../../css/pastPageants.css';
import '../../css/pageantCard.css';

const PastPageants = () => {
  const { user } = useAuth();
  const [pageants, setPageants] = useState([]);
  const [filteredPageants, setFilteredPageants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortOption, setSortOption] = useState('newest'); // newest, oldest, placement
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for frontend development
  const mockPageants = [
    {
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
      year: 2024,
      categories: [
        { category: 'Evening Gown', placement: 1, score: 9.8 },
        { category: 'Talent', placement: 3, score: 8.7 },
        { category: 'Interview', placement: 2, score: 9.2 }
      ],
      overallPlacement: 2
    },
    {
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
      year: 2023,
      categories: [
        { category: 'Formal Wear', placement: 5, score: 8.2 },
        { category: 'Winter Theme Costume', placement: 1, score: 9.9 },
        { category: 'Question and Answer', placement: 3, score: 8.8 }
      ],
      overallPlacement: 3
    },
    {
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
      year: 2023,
      categories: [
        { category: 'Casual Wear', placement: 1, score: 9.7 },
        { category: 'Talent Showcase', placement: 1, score: 9.8 },
        { category: 'Personality Interview', placement: 2, score: 9.5 }
      ],
      overallPlacement: 1
    },
    {
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
      year: 2022,
      categories: [
        { category: 'Swimwear', placement: 4, score: 8.5 },
        { category: 'Evening Gown', placement: 2, score: 9.3 },
        { category: 'On-Stage Question', placement: 5, score: 8.2 }
      ],
      overallPlacement: 4
    }
  ];

  // Get unique years for filter dropdown
  const getUniqueYears = () => {
    if (pageants.length === 0) return [];
    
    const years = pageants.map(p => p.year);
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
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.location?.venue && p.location.venue.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by year
      if (filterYear !== 'all') {
        filtered = filtered.filter(p => p.year === parseInt(filterYear));
      }
      
      // Sort pageants
      if (sortOption === 'newest') {
        filtered.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
      } else if (sortOption === 'oldest') {
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      } else if (sortOption === 'placement') {
        filtered.sort((a, b) => (a.overallPlacement || 999) - (b.overallPlacement || 999));
      }
      
      setFilteredPageants(filtered);
    }
  }, [pageants, searchTerm, filterYear, sortOption]);

  // Calculate longest streak of top-3 placements
  const calculateLongestStreak = (pageants) => {
    if (!pageants.length) return 0;
    
    // Sort pageants by date (oldest to newest)
    const sortedPageants = [...pageants].sort((a, b) => 
      new Date(a.startDate) - new Date(b.startDate)
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
  };

  // Open modal with selected pageant details
  const openPageantDetails = (pageant) => {
    setSelectedPageant(pageant);
    setIsModalOpen(true);
    
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closePageantDetails = () => {
    setIsModalOpen(false);
    setSelectedPageant(null);
    
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Custom renderer for the View Details button in PageantCard
  const renderViewDetailsButton = (pageant) => (
    <button 
      className="btn btn-outline-primary w-100"
      onClick={(e) => {
        e.preventDefault(); // Prevent any default anchor behavior
        e.stopPropagation(); // Prevent event bubbling
        openPageantDetails(pageant);
      }}
    >
      <FontAwesomeIcon icon={faEye} className="me-2" />
      View Details
    </button>
  );

  return (
    <div className="past-pageants-container">
      <div className="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="u-text-dark mb-1">Past Pageants</h2>
          <p className="u-text-dark">View your pageant history and achievements</p>
        </div>
        <div className="d-flex">
          <Link to="/contestant-dashboard/join-pageant" className="btn btn-outline-primary ms-2">
            <FontAwesomeIcon icon={faTrophy} className="me-2" />
            Join New Pageant
          </Link>
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
            {filteredPageants.map((pageant, index) => (
              <div className="col-md-6 col-lg-4" key={pageant._id}>
                <PageantCard 
                  pageant={pageant} 
                  type="past" 
                  showCategories={false}
                  showResults={true}
                  className={`delay-${index % 6}`} // For staggered animation, cycle through 6 delays
                  // Pass custom renderer to override the default Link behavior
                  renderActions={() => renderViewDetailsButton(pageant)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PageantDetailsModal */}
      {isModalOpen && (
        <PageantDetailsModal 
          pageant={selectedPageant}
          isOpen={isModalOpen}
          onClose={closePageantDetails}
        />
      )}
    </div>
  );
};

export default PastPageants;
// client/src/pages/dashboard/MyPageants.jsx (Updated with PageantCard component)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faExclamationTriangle, 
  faFilter,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import PageantCard from './PageantCard';
import '../../css/myPageants.css';
import '../../css/pageantCard.css';

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
      status: 'published',
      categories: ['Evening Gown', 'Talent', 'Interview']
    },
    {
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
      status: 'published',
      categories: ['Formal Wear', 'Winter Theme Costume', 'Question and Answer']
    },
    {
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
      status: 'in-progress',
      categories: ['Casual Wear', 'Talent Showcase', 'Personality Interview']
    },
    {
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
      status: 'in-progress',
      categories: ['Floral Couture', 'Nature Talent', 'Environmental Q&A']
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
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.location?.venue && p.location.venue.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by status
      const today = new Date();
      if (filterStatus === 'upcoming') {
        filtered = filtered.filter(p => new Date(p.startDate) > today);
      } else if (filterStatus === 'in-progress') {
        filtered = filtered.filter(p => {
          const startDate = new Date(p.startDate);
          const endDate = new Date(p.endDate);
          return startDate <= today && endDate >= today;
        });
      }
      
      // Sort by closest start date to farthest
      filtered.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
      
      setFilteredPageants(filtered);
    }
  }, [pageants, searchTerm, filterStatus]);

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
            {filteredPageants.map((pageant, index) => (
              <div className="col-md-6 col-lg-4" key={pageant._id}>
                <PageantCard 
                  pageant={pageant} 
                  type="active" 
                  showCategories={true}
                  className={`delay-${index}`} // For staggered animation
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageants;
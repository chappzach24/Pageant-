// Updated MyPageants.jsx with real API data fetching
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faExclamationTriangle, 
  faFilter,
  faSearch,
  faEye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import PageantCard from './PageantCard';
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import '../../css/myPageants.css';
import '../../css/pageantCard.css';
import '../../css/pageantDetailsModal.css';

const MyPageants = () => {
  const { user } = useAuth();
  const [pageants, setPageants] = useState([]);
  const [filteredPageants, setFilteredPageants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, in-progress
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch participant data from the API
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/participants`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your pageant registrations');
        }

        const data = await response.json();
        
        if (data.success && data.participants) {
          console.log('API returned pageant data:', data.participants);
          
          // Process the participants data to extract pageant information
          const processedPageants = processPageantData(data.participants);
          setPageants(processedPageants);
          setFilteredPageants(processedPageants);
        } else {
          throw new Error('Failed to get participation data from server');
        }
      } catch (err) {
        console.error('Error fetching pageants:', err);
        setError('Failed to load your pageants. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchParticipantData();
    }
  }, [user]);

  // Process the participant data to extract pageant information
  const processPageantData = (participants) => {
    if (!participants || !Array.isArray(participants)) {
      return [];
    }
    
    return participants.map(participant => {
      // Extract pageant info from the participant object
      const pageantInfo = participant.pageant;
      
      // Add the contestant's categories to the pageant object
      const pageantWithCategories = {
        ...pageantInfo,
        categories: participant.categories.map(cat => cat.category)
      };
      
      return pageantWithCategories;
    });
  };

  // Filter pageants based on search term and status
  useEffect(() => {
    if (pageants.length) {
      let filtered = [...pageants];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof p.organization === 'string' && p.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof p.organization === 'object' && p.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.location?.venue && p.location.venue.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by status
      const today = new Date();
      if (filterStatus === 'upcoming') {
        filtered = filtered.filter(p => {
          const startDate = new Date(p.startDate);
          return startDate > today;
        });
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

  // Prepare pageant data for the modal
  const preparePageantForModal = (pageant) => {
    // Defensive check
    if (!pageant) return null;
    
    // Handle the organization property specifically to prevent object rendering issues
    let organizationName = '';
    
    if (pageant.organization) {
      if (typeof pageant.organization === 'string') {
        organizationName = pageant.organization;
      } else if (typeof pageant.organization === 'object') {
        // Extract the name property or use a default
        organizationName = pageant.organization.name || 'Unknown Organization';
      }
    }
    
    // Create a clean object with proper values
    return {
      _id: pageant._id || '',
      name: pageant.name || 'Untitled Pageant',
      organization: organizationName,
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
      // Properly preserve the entryFee object structure
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

  // Open modal with selected pageant details
  const openPageantDetails = (pageant) => {
    console.log('Opening pageant details for:', pageant.name);
    
    // Use the helper to clean the pageant object
    const cleanPageant = preparePageantForModal(pageant);
    
    setSelectedPageant(cleanPageant);
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
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </div>
      ) : filteredPageants.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          No pageants found. You haven't registered for any pageants yet, or none match your current filters.
        </div>
      ) : (
        <div className="pageants-grid">
          <div className="row g-4">
            {filteredPageants.map((pageant, index) => (
              <div className="col-md-6 col-lg-4" key={pageant._id || index}>
                <PageantCard 
                  pageant={pageant} 
                  type="active" 
                  showCategories={true}
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

export default MyPageants;
// Updated ContestantDashboardHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faCalendarAlt, 
  faCheckCircle, 
  faExclamationTriangle,
  faUsers,
  faHistory,
  faFire,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import PageantCard from './PageantCard';
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import '../../css/myPageants.css';
import '../../css/pageantCard.css';

const ContestantDashboardHome = () => {
  const { user } = useAuth();
  const [upcomingPageants, setUpcomingPageants] = useState([]);
  const [activePageants, setActivePageants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Added states for modal
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchContestantData = async () => {
      try {
        // Fetch participant data for the logged-in user
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/participants`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pageant data');
        }

        const data = await response.json();
        if (data.participants && data.participants.length > 0) {
          debugParticipantData(data.participants);
        }
        
        const now = new Date();
        
        // Filter and process pageant data
        const processPageantsData = (participants) => {
          return participants.map(p => {
            // Ensure the pageant object has all necessary fields
            const pageant = p.pageant;
            
            // If pageant organization is populated as an object, make sure we retain the structure
            // If not, we'll rely on the PageantCard to handle the display
            
            return {
              ...p,
              pageant: {
                ...pageant,
                // Ensure categories are properly formatted
                categories: p.categories ? p.categories.map(cat => ({
                  category: cat.category,
                  score: cat.score,
                  notes: cat.notes
                })) : []
              }
            };
          });
        };
        
        // Filter upcoming pageants (pageants that haven't started yet)
        const upcoming = data.participants
          .filter(p => {
            const startDate = new Date(p.pageant.startDate);
            return startDate > now;
          })
          .map(p => processPageantsData([p])[0]);
        
        // Filter active pageants (pageants that have started but not ended)
        const active = data.participants
          .filter(p => {
            const startDate = new Date(p.pageant.startDate);
            const endDate = new Date(p.pageant.endDate);
            return startDate <= now && endDate >= now;
          })
          .map(p => processPageantsData([p])[0]);
        
        console.log('Processed upcoming pageants:', upcoming);
        console.log('Processed active pageants:', active);
        
        setUpcomingPageants(upcoming);
        setActivePageants(active);
      } catch (err) {
        console.error('Error fetching contestant data:', err);
        setError('Failed to load your pageant data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchContestantData();
    }
  }, [user]);

  useEffect(() => {
    console.log("active", upcomingPageants);
  })

  // Debugging function to check data structure
  const debugParticipantData = (participants) => {
    console.log('=========== DEBUGGING PARTICIPANT DATA ===========');
    
    participants.forEach((p, index) => {
      console.log(`Participant ${index + 1}:`, {
        participantId: p._id,
        pageantId: p.pageant?._id,
        pageantName: p.pageant?.name,
        
        // Organization data is what we want to check
        organizationType: typeof p.pageant?.organization,
        organizationIsObject: typeof p.pageant?.organization === 'object',
        organizationIsString: typeof p.pageant?.organization === 'string',
        organizationHasName: p.pageant?.organization?.name !== undefined,
        
        // The raw organization data
        organizationData: p.pageant?.organization,
        
        // If it's an object, check the structure
        organizationName: typeof p.pageant?.organization === 'object' 
          ? p.pageant?.organization?.name 
          : p.pageant?.organization,
          
        // Categories data  
        categoriesCount: p.categories?.length,
        categorySample: p.categories?.length > 0 ? p.categories[0] : null
      });
    });
    
    console.log('===================================================');
    
    return participants;
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Add this at the top of your ContestantDashboardHome.jsx file
  const debugPageantObject = (pageant) => {
    console.log('Pageant object structure:', JSON.stringify(pageant, null, 2));
    
    // Check for circular references or non-serializable values
    const seen = new WeakSet();
    const detectCircular = (obj, path = '') => {
      if (obj && typeof obj === 'object') {
        if (seen.has(obj)) {
          console.warn(`Circular reference detected at ${path}`);
          return true;
        }
        seen.add(obj);
        
        for (const key in obj) {
          if (detectCircular(obj[key], `${path}.${key}`)) {
            return true;
          }
        }
      }
      return false;
    };
    
    detectCircular(pageant);
    
    // Check for any DOM elements accidentally in the object
    const detectDOM = (obj, path = '') => {
      if (obj && typeof obj === 'object') {
        if (obj instanceof HTMLElement) {
          console.warn(`DOM element found at ${path}`);
          return true;
        }
        
        for (const key in obj) {
          if (detectDOM(obj[key], `${path}.${key}`)) {
            return true;
          }
        }
      }
      return false;
    };
    
    detectDOM(pageant);
    
    return pageant;
  };

  const preparePageantForModal = (pageant) => {
    // Defensive check
    if (!pageant) return null;
    
    // Handle the organization property specifically
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
  
  // Then update your openPageantDetails function to use this helper:
  const openPageantDetails = (pageant) => {
    console.log('Opening pageant details for:', pageant);
    
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
    <div className="dashboard-home">
      <div className="welcome-section mb-4">
        <h2 className="u-text-dark mb-1">Welcome back, {user?.firstName || 'Contestant'}!</h2>
        <p className="u-text-dark">Here's what's happening with your pageants</p>
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
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faTrophy} />
                  </div>
                  <div className="stat-value">{activePageants.length}</div>
                  <div className="stat-label">Active Pageants</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className="stat-value">{upcomingPageants.length}</div>
                  <div className="stat-label">Upcoming Pageants</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="stat-value">{user?.ageGroup || 'N/A'}</div>
                  <div className="stat-label">Your Age Group</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Pageants Section */}
          <div className="active-pageants-section mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="u-text-dark">Active Pageants</h4>
              <Link to="/contestant-dashboard/my-pageants" className="btn btn-sm btn-outline-dark">View All</Link>
            </div>

            {activePageants.length === 0 ? (
              <div className="alert alert-info" role="alert">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                You have no active pageants. Join a pageant to get started!
              </div>
            ) : (
              <div className="row g-4">
                {activePageants.slice(0, 2).map((participation, index) => (
                  <div className="col-md-6" key={index}>
                    <PageantCard 
                      pageant={participation.pageant}
                      type="active"
                      showCategories={true}
                      className={`delay-${index % 6}`}
                      renderActions={() => renderViewDetailsButton(participation.pageant)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Pageants Section */}
          <div className="upcoming-pageants-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="u-text-dark">Upcoming Pageants</h4>
              <Link to="/contestant-dashboard/join-pageant" className="btn btn-sm btn-outline-dark">Find More</Link>
            </div>

            {upcomingPageants.length === 0 ? (
              <div className="alert alert-info" role="alert">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                You have no upcoming pageants. Browse available pageants to join one!
              </div>
            ) : (
              <div className="row g-4">
                {upcomingPageants.slice(0, 2).map((participation, index) => (
                  <div className="col-md-6" key={index}>
                    <PageantCard 
                      pageant={participation.pageant}
                      type="active"
                      showCategories={true}
                      className={`delay-${index % 6}`}
                      renderActions={() => renderViewDetailsButton(participation.pageant)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* PageantDetailsModal */}
      {isModalOpen && (
        <PageantDetailsModal 
          pageant={selectedPageant}
          isOpen={isModalOpen}
          onClose={closePageantDetails}
        />
      )}

      {/* PageantDetailsModal with Error Boundary */}
      {isModalOpen && (
        <ErrorBoundary fallback={
          <div className="alert alert-danger">
            <h4>Error displaying pageant details</h4>
            <p>There was a problem showing the pageant information. Please try again later.</p>
            <button 
              className="btn btn-secondary mt-3"
              onClick={closePageantDetails}
            >
              Close
            </button>
          </div>
        }>
          <PageantDetailsModal 
            pageant={selectedPageant}
            isOpen={isModalOpen}
            onClose={closePageantDetails}
          />
        </ErrorBoundary>
      )}
      </div>
  );
};

export default ContestantDashboardHome;
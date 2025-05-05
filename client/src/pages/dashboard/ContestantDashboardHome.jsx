// client/src/pages/dashboard/ContestantDashboardHome.jsx
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
  faFire
} from '@fortawesome/free-solid-svg-icons';
import PageantCard from './PageantCard';
import '../../css/myPageants.css';
import '../../css/pageantCard.css';

const ContestantDashboardHome = () => {
  const { user } = useAuth();
  const [upcomingPageants, setUpcomingPageants] = useState([]);
  const [activePageants, setActivePageants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContestantDashboardHome;
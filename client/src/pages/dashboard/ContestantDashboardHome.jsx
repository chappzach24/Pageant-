// client/src/pages/dashboard/ContestantDashboardHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faCalendarAlt, 
  faCheckCircle, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

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
        
        const now = new Date();
        
        // Filter upcoming pageants (pageants that haven't started yet)
        const upcoming = data.participants.filter(p => {
          const startDate = new Date(p.pageant.startDate);
          return startDate > now;
        });
        
        // Filter active pageants (pageants that have started but not ended)
        const active = data.participants.filter(p => {
          const startDate = new Date(p.pageant.startDate);
          const endDate = new Date(p.pageant.endDate);
          return startDate <= now && endDate >= now;
        });
        
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

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-section mb-4">
        <h2 className="u-text-dark">Welcome back, {user?.firstName || 'Contestant'}!</h2>
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
                  <div 
                    className="stat-icon mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <FontAwesomeIcon icon={faTrophy} size="lg" style={{ color: 'var(--brand-color)' }} />
                  </div>
                  <h3 className="u-text-dark">{activePageants.length}</h3>
                  <p className="u-text-dark">Active Pageants</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div 
                    className="stat-icon mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} size="lg" style={{ color: 'var(--brand-color)' }} />
                  </div>
                  <h3 className="u-text-dark">{upcomingPageants.length}</h3>
                  <p className="u-text-dark">Upcoming Pageants</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div 
                    className="stat-icon mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <FontAwesomeIcon icon={faTrophy} size="lg" style={{ color: 'var(--brand-color)' }} />
                  </div>
                  <h3 className="u-text-dark">{user?.ageGroup || 'N/A'}</h3>
                  <p className="u-text-dark">Your Age Group</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Pageants Section */}
          <div className="active-pageants-section mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="u-text-dark">Active Pageants</h4>
              <Link to="/contestant-dashboard/active-pageants" className="btn btn-sm btn-outline-dark">View All</Link>
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
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{participation.pageant.name}</h5>
                        <p className="u-text-dark mb-2">
                          <strong>Status:</strong> <span className="badge bg-success">In Progress</span>
                        </p>
                        <p className="u-text-dark mb-2">
                          <strong>Date:</strong> {formatDate(participation.pageant.startDate)} - {formatDate(participation.pageant.endDate)}
                        </p>
                        <p className="u-text-dark mb-2">
                          <strong>Location:</strong> {participation.pageant.location?.venue || 'Online'}
                        </p>
                        <Link to={`/contestant-dashboard/pageant/${participation.pageant._id}`} className="btn btn-dark mt-2">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Pageants Section */}
          <div className="upcoming-pageants-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="u-text-dark">Upcoming Pageants</h4>
              <Link to="/contestant-dashboard/join-pageants" className="btn btn-sm btn-outline-dark">Find More</Link>
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
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{participation.pageant.name}</h5>
                        <p className="u-text-dark mb-2">
                          <strong>Status:</strong> <span className="badge bg-warning text-dark">Upcoming</span>
                        </p>
                        <p className="u-text-dark mb-2">
                          <strong>Date:</strong> {formatDate(participation.pageant.startDate)} - {formatDate(participation.pageant.endDate)}
                        </p>
                        <p className="u-text-dark mb-2">
                          <strong>Location:</strong> {participation.pageant.location?.venue || 'Online'}
                        </p>
                        <div className="mt-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                          <span className="u-text-dark">Registration Complete</span>
                        </div>
                      </div>
                    </div>
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
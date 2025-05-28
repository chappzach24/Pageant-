// client/src/pages/dashboard/ContestantDashboardHome.jsx - REFACTORED VERSION
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faCalendarAlt, 
  faUsers,
  faExclamationTriangle,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  StatCard 
} from '../../components/dashboard/common';

// Import specialized components
import { PageantGrid } from '../../components/dashboard/contestant';

// Import custom hooks and utilities
import { useAuth } from '../../context/AuthContext';
import { usePageantData } from '../../hooks/usePageantData';
import { preparePageantForModal } from '../../utils';

// Import existing components
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import ErrorBoundary from '../../components/ErrorBoundary';

const ContestantDashboardHome = () => {
  const { user } = useAuth();
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom hook for pageant data
  const { participations, loading, error } = usePageantData();

  // Process and categorize pageants
  const now = new Date();
  const upcomingPageants = participations.filter(p => {
    const startDate = new Date(p.pageant.startDate);
    return startDate > now;
  });

  const activePageants = participations.filter(p => {
    const startDate = new Date(p.pageant.startDate);
    const endDate = new Date(p.pageant.endDate);
    return startDate <= now && endDate >= now;
  });

  // Modal handlers
  const openPageantDetails = (pageant) => {
    const cleanPageant = preparePageantForModal(pageant);
    setSelectedPageant(cleanPageant);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePageantDetails = () => {
    setIsModalOpen(false);
    setSelectedPageant(null);
    document.body.style.overflow = 'auto';
  };

  // Custom renderer for the View Details button
  const renderViewDetailsButton = (pageant) => (
    <button 
      className="btn btn-outline-primary w-100"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openPageantDetails(pageant);
      }}
    >
      <FontAwesomeIcon icon={faEye} className="me-2" />
      View Details
    </button>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section mb-4">
        <h2 className="u-text-dark mb-1">Welcome back, {user?.firstName || 'Contestant'}!</h2>
        <p className="u-text-dark">Here's what's happening with your pageants</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <StatCard 
            icon={faTrophy}
            value={activePageants.length}
            label="Active Pageants"
          />
        </div>
        
        <div className="col-md-4">
          <StatCard 
            icon={faCalendarAlt}
            value={upcomingPageants.length}
            label="Upcoming Pageants"
          />
        </div>
        
        <div className="col-md-4">
          <StatCard 
            icon={faUsers}
            value={user?.ageGroup || 'N/A'}
            label="Your Age Group"
          />
        </div>
      </div>

      {/* Active Pageants Section */}
      <div className="active-pageants-section mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="u-text-dark">Active Pageants</h4>
          <Link to="/contestant-dashboard/my-pageants" className="btn btn-sm btn-outline-dark">
            View All
          </Link>
        </div>

        {activePageants.length === 0 ? (
          <EmptyState 
            icon={faExclamationTriangle}
            message="You have no active pageants. Join a pageant to get started!"
            variant="info"
          />
        ) : (
          <PageantGrid 
            pageants={activePageants.slice(0, 2).map(p => p.pageant)}
            type="active"
            showCategories={true}
            renderActions={renderViewDetailsButton}
          />
        )}
      </div>

      {/* Upcoming Pageants Section */}
      <div className="upcoming-pageants-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="u-text-dark">Upcoming Pageants</h4>
          <Link to="/contestant-dashboard/join-pageant" className="btn btn-sm btn-outline-dark">
            Find More
          </Link>
        </div>

        {upcomingPageants.length === 0 ? (
          <EmptyState 
            icon={faExclamationTriangle}
            message="You have no upcoming pageants. Browse available pageants to join one!"
            variant="info"
          />
        ) : (
          <PageantGrid 
            pageants={upcomingPageants.slice(0, 2).map(p => p.pageant)}
            type="active"
            showCategories={true}
            renderActions={renderViewDetailsButton}
          />
        )}
      </div>

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
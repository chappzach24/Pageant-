// client/src/pages/dashboard/MyPageants.jsx - REFACTORED VERSION
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faExclamationTriangle,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  SearchFilterBar, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert 
} from '../../components/dashboard/common';

// Import specialized components
import { PageantGrid } from '../../components/dashboard/contestant';

// Import custom hooks and utilities
import { usePageantData } from '../../hooks/usePageantData';
import { usePageantFilters } from '../../hooks/usePageantFilters';
import { preparePageantForModal } from '../../utils';

// Import existing components
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import '../../css/myPageants.css';
import '../../css/pageantCard.css';
import '../../css/pageantDetailsModal.css';

const MyPageants = () => {
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom hooks
  const { participations, loading, error } = usePageantData();
  
  // Process pageants to extract pageant data and add contestant categories
  const processedPageants = participations.map(participant => ({
    ...participant.pageant,
    categories: participant.categories.map(cat => cat.category)
  }));

  const { 
    searchTerm, 
    setSearchTerm, 
    filteredPageants 
  } = usePageantFilters(processedPageants, 'upcoming');

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

  return (
    <div className="active-pageants-container">
      <DashboardPageHeader 
        title="My Upcoming Pageants"
        subtitle="View all your upcoming pageant registrations"
      >
        <Link to="/contestant-dashboard/join-pageant" className="btn btn-primary">
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Join New Pageant
        </Link>
      </DashboardPageHeader>

      {/* Search Bar */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search upcoming pageants by name, organization, or location"
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : filteredPageants.length === 0 ? (
        <EmptyState 
          icon={faExclamationTriangle}
          message="No upcoming pageants found. You haven't registered for any future pageants yet."
          variant="info"
          colorClass='u-text-dark'
        />
      ) : (
        <PageantGrid 
          pageants={filteredPageants}
          type="active"
          showCategories={true}
          renderActions={renderViewDetailsButton}
        />
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
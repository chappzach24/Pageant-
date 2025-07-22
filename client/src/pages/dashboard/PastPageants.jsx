// client/src/pages/dashboard/PastPageants.jsx - REFACTORED VERSION
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
import { 
  PageantStatsRow, 
  PageantGrid 
} from '../../components/dashboard/contestant';

// Import custom hooks and utilities
import { usePageantData } from '../../hooks/usePageantData';
import { usePageantFilters } from '../../hooks/usePageantFilters';
import { usePageantStats } from '../../hooks/usePageantStats';
import { preparePageantForModal } from '../../utils';

// Import existing components
import PageantDetailsModal from '../../components/dashboard/PageantDetailsModal';
import '../../css/pastPageants.css';
import '../../css/pageantCard.css';

const PastPageants = () => {
  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom hooks
  const { participations, loading, error } = usePageantData();
  
  // Process pageants to extract pageant data and add contestant categories
  const processedPageants = participations.map(participant => ({
    ...participant.pageant,
    categories: participant.categories.map(cat => ({
      category: cat.category,
      score: cat.score,
      placement: cat.placement,
      notes: cat.notes
    })),
    overallPlacement: participant.overallPlacement
  }));

  const { 
    searchTerm, 
    setSearchTerm, 
    filterYear, 
    setFilterYear, 
    sortOption, 
    setSortOption, 
    filteredPageants, 
    availableYears 
  } = usePageantFilters(processedPageants, 'past');

  const stats = usePageantStats(processedPageants);

  // Filter and sort options
  const filterOptions = [
    { value: 'all', label: 'All Years' },
    ...availableYears.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'placement', label: 'Best Placement' }
  ];

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
    <div className="past-pageants-container">
      <DashboardPageHeader 
        title="Past Pageants"
        subtitle="View your pageant history and achievements"
      >
        <Link to="/contestant-dashboard/join-pageant" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faTrophy} className="me-2" />
          Join New Pageant
        </Link>
      </DashboardPageHeader>

      {/* Stats Summary */}
      <PageantStatsRow 
        totalPageants={stats.totalPageants}
        firstPlaceWins={stats.firstPlaceWins}
        podiumFinishes={stats.podiumFinishes}
        longestStreak={stats.longestStreak}
      />

      {/* Search and Filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        selectedFilter={filterYear}
        onFilterChange={setFilterYear}
        sortOptions={sortOptions}
        selectedSort={sortOption}
        onSortChange={setSortOption}
        placeholder="Search past pageants..."
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : filteredPageants.length === 0 ? (
        <EmptyState 
          icon={faExclamationTriangle}
          message="No past pageants found matching your criteria. Try adjusting your search or filter."
          variant="info"
          colorClass='u-text-dark'
        />
      ) : (
        <PageantGrid 
          pageants={filteredPageants}
          type="past"
          showCategories={false}
          showResults={true}
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

export default PastPageants;
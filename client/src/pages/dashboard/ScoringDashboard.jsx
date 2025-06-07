import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faUsers,
  faClipboardList,
  faChartBar,
  faCalendarAlt,
  faEye,
  faDownload,
  faCheckCircle,
  faClock,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { DashboardPageHeader, LoadingSpinner, EmptyState, SearchFilterBar } from '../../components/dashboard/common';

const ScoringDashboard = () => {
  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');

  // Fetch pageants for scoring
  useEffect(() => {
    const fetchPageants = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/scoring/pageants`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch pageants');
        }

        const data = await response.json();
        setPageants(data.pageants || []);
      } catch (error) {
        console.error('Error fetching pageants:', error);
        setError(error.message || 'Failed to fetch pageants');
      } finally {
        setLoading(false);
      }
    };

    fetchPageants();
  }, []);

  // Filter and sort pageants
  const filteredPageants = pageants
    .filter(pageant => {
      const matchesSearch = pageant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pageant.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || pageant.scoringStatus === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'contestants':
          return b.totalContestants - a.totalContestants;
        case 'progress':
          return b.categoriesCompleted - a.categoriesCompleted;
        default:
          return 0;
      }
    });

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-secondary', icon: faClock, text: 'Pending' },
      active: { bg: 'bg-success', icon: faCheckCircle, text: 'Active' },
      completed: { bg: 'bg-primary', icon: faTrophy, text: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`badge ${config.bg} me-2`}>
        <FontAwesomeIcon icon={config.icon} className="me-1" />
        {config.text}
      </span>
    );
  };

  // Get progress percentage
  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading scoring dashboard..." />;
  }

  if (error) {
    return (
      <div className="container-fluid">
        <DashboardPageHeader
          title="Scoring & Results"
          subtitle="Manage scoring for your pageants"
        />
        <div className="alert alert-danger" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <DashboardPageHeader
        title="Scoring & Results"
        subtitle="Manage scoring for your pageants and view results"
      />

      {/* Search and Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { value: 'all', label: 'All Pageants' },
          { value: 'pending', label: 'Pending' },
          { value: 'active', label: 'Active Scoring' },
          { value: 'completed', label: 'Completed' }
        ]}
        sortOptions={[
          { value: 'startDate', label: 'Date (Newest)' },
          { value: 'name', label: 'Name (A-Z)' },
          { value: 'contestants', label: 'Most Contestants' },
          { value: 'progress', label: 'Most Progress' }
        ]}
        selectedFilter={filterStatus}
        onFilterChange={setFilterStatus}
        selectedSort={sortBy}
        onSortChange={setSortBy}
        placeholder="Search pageants..."
      />

      {/* Pageants List */}
      {filteredPageants.length === 0 ? (
        <EmptyState
          icon={faTrophy}
          title="No Pageants Found"
          message={searchTerm || filterStatus !== 'all' 
            ? "No pageants match your current search or filter criteria."
            : "You don't have any pageants yet. Create your first pageant to get started with scoring."
          }
          actionButton={
            !searchTerm && filterStatus === 'all' && (
              <Link to="/organization-dashboard/organizations" className="btn btn-primary">
                <FontAwesomeIcon icon={faTrophy} className="me-2" />
                Create First Pageant
              </Link>
            )
          }
        />
      ) : (
        <div className="row g-4">
          {filteredPageants.map((pageant) => (
            <div className="col-md-6 col-lg-4" key={pageant._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="card-title mb-0">{pageant.name}</h6>
                  {getStatusBadge(pageant.scoringStatus)}
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <div className="small text-muted mb-1">Organization</div>
                    <div className="fw-medium">{pageant.organization?.name || 'Unknown'}</div>
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Event Date</div>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                      {formatDate(pageant.startDate)}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="text-center p-2 bg-light rounded">
                        <div className="h5 mb-0 text-primary">{pageant.totalContestants}</div>
                        <small className="text-muted">Contestants</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 bg-light rounded">
                        <div className="h5 mb-0 text-info">{pageant.totalCategories}</div>
                        <small className="text-muted">Categories</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted">Scoring Progress</span>
                      <span className="small">
                        {pageant.categoriesCompleted}/{pageant.totalCategories}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${getProgressColor(getProgressPercentage(pageant.categoriesCompleted, pageant.totalCategories))}`}
                        role="progressbar"
                        style={{ width: `${getProgressPercentage(pageant.categoriesCompleted, pageant.totalCategories)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <Link
                        to={`/organization-dashboard/scoring/pageant/${pageant._id}`}
                        className="btn btn-primary"
                      >
                        <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                        {pageant.scoringStatus === 'completed' ? 'View Results' : 'Manage Scoring'}
                      </Link>
                      
                      {pageant.scoringStatus === 'completed' && (
                        <div className="btn-group">
                          <Link
                            to={`/organization-dashboard/scoring/pageant/${pageant._id}/results`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <FontAwesomeIcon icon={faChartBar} className="me-1" />
                            Results
                          </Link>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              // Handle export functionality
                              console.log('Export results for', pageant._id);
                            }}
                          >
                            <FontAwesomeIcon icon={faDownload} className="me-1" />
                            Export
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      {filteredPageants.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">Summary Statistics</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="h4 text-primary mb-1">{filteredPageants.length}</div>
                    <div className="small text-muted">Total Pageants</div>
                  </div>
                  <div className="col-md-3">
                    <div className="h4 text-success mb-1">
                      {filteredPageants.filter(p => p.scoringStatus === 'completed').length}
                    </div>
                    <div className="small text-muted">Completed</div>
                  </div>
                  <div className="col-md-3">
                    <div className="h4 text-warning mb-1">
                      {filteredPageants.filter(p => p.scoringStatus === 'active').length}
                    </div>
                    <div className="small text-muted">Active Scoring</div>
                  </div>
                  <div className="col-md-3">
                    <div className="h4 text-info mb-1">
                      {filteredPageants.reduce((sum, p) => sum + p.totalContestants, 0)}
                    </div>
                    <div className="small text-muted">Total Contestants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoringDashboard;
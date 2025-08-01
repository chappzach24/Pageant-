import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCheck,
  faClipboardCheck,
  faClock,
  faExclamationTriangle,
  faCalendarAlt,
  faUsers,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faTrophy,
  faMoneyBillWave,
  faSearch,
  faFilter,
  faSort
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  SearchFilterBar,
  StatCard
} from '../../components/dashboard/common';

// Import utilities
import { formatDate, formatCurrency } from '../../utils';

// Import CSS
import '../../css/applicationManagement.css';

const ApplicationManagement = () => {
  const navigate = useNavigate();
  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Fetch pageants with pending applications
  useEffect(() => {
    const fetchPageantsWithApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const mockPageants = [
          {
            _id: 'pageant1',
            name: 'Miss Spring Festival 2025',
            pageantID: 'SPF2025-001',
            startDate: '2025-04-15',
            endDate: '2025-04-16',
            registrationDeadline: '2025-03-15',
            entryFee: { amount: 125, currency: 'USD' },
            location: {
              venue: 'Grand Ballroom',
              address: { city: 'Columbus', state: 'OH' }
            },
            status: 'published',
            pendingApplications: 5,
            approvedApplications: 12,
            rejectedApplications: 2,
            totalApplications: 19,
            daysUntilDeadline: 45
          },
          {
            _id: 'pageant2',
            name: 'Teen Miss Summer 2025',
            pageantID: 'TMS2025-002',
            startDate: '2025-06-20',
            endDate: '2025-06-21',
            registrationDeadline: '2025-05-20',
            entryFee: { amount: 95, currency: 'USD' },
            location: {
              venue: 'Civic Center',
              address: { city: 'Cleveland', state: 'OH' }
            },
            status: 'published',
            pendingApplications: 8,
            approvedApplications: 6,
            rejectedApplications: 1,
            totalApplications: 15,
            daysUntilDeadline: 110
          },
          {
            _id: 'pageant3',
            name: 'Little Miss Sunshine 2025',
            pageantID: 'LMS2025-003',
            startDate: '2025-08-10',
            endDate: '2025-08-11',
            registrationDeadline: '2025-07-10',
            entryFee: { amount: 75, currency: 'USD' },
            location: {
              venue: 'Community Theater',
              address: { city: 'Toledo', state: 'OH' }
            },
            status: 'published',
            pendingApplications: 3,
            approvedApplications: 18,
            rejectedApplications: 0,
            totalApplications: 21,
            daysUntilDeadline: 161
          },
          {
            _id: 'pageant4',
            name: 'Miss Holiday Gala 2024',
            pageantID: 'MHG2024-004',
            startDate: '2024-12-15',
            endDate: '2024-12-15',
            registrationDeadline: '2024-11-15',
            entryFee: { amount: 150, currency: 'USD' },
            location: {
              venue: 'Hotel Ballroom',
              address: { city: 'Cincinnati', state: 'OH' }
            },
            status: 'registration-closed',
            pendingApplications: 2,
            approvedApplications: 25,
            rejectedApplications: 3,
            totalApplications: 30,
            daysUntilDeadline: -47 // Past deadline
          }
        ];

        setPageants(mockPageants);
      } catch (error) {
        console.error('Error fetching pageants with applications:', error);
        setError('Failed to load pageant applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageantsWithApplications();
  }, []);

  // Filter and sort pageants
  const filteredPageants = pageants
    .filter(pageant => {
      const matchesSearch = 
        pageant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pageant.pageantID.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (statusFilter === 'urgent') {
        matchesFilter = pageant.daysUntilDeadline <= 7 && pageant.daysUntilDeadline > 0;
      } else if (statusFilter === 'pending') {
        matchesFilter = pageant.pendingApplications > 0;
      } else if (statusFilter === 'active') {
        matchesFilter = pageant.status === 'published' && pageant.daysUntilDeadline > 0;
      }
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.daysUntilDeadline - b.daysUntilDeadline;
        case 'pending':
          return b.pendingApplications - a.pendingApplications;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'applications':
          return b.totalApplications - a.totalApplications;
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const totalPendingApplications = pageants.reduce((sum, p) => sum + p.pendingApplications, 0);
  const urgentPageants = pageants.filter(p => p.daysUntilDeadline <= 7 && p.daysUntilDeadline > 0).length;
  const activePageants = pageants.filter(p => p.status === 'published' && p.daysUntilDeadline > 0).length;
  const totalApplications = pageants.reduce((sum, p) => sum + p.totalApplications, 0);

  // Get urgency level for deadline
  const getUrgencyLevel = (daysUntil) => {
    if (daysUntil < 0) return 'expired';
    if (daysUntil <= 3) return 'critical';
    if (daysUntil <= 7) return 'urgent';
    if (daysUntil <= 30) return 'moderate';
    return 'normal';
  };

  // Get urgency badge
  const getUrgencyBadge = (daysUntil) => {
    const urgency = getUrgencyLevel(daysUntil);
    
    switch (urgency) {
      case 'expired':
        return <span className="badge bg-secondary">Expired</span>;
      case 'critical':
        return <span className="badge bg-danger">Critical - {daysUntil} days</span>;
      case 'urgent':
        return <span className="badge bg-warning text-dark">Urgent - {daysUntil} days</span>;
      case 'moderate':
        return <span className="badge bg-info">{daysUntil} days left</span>;
      default:
        return <span className="badge bg-success">{daysUntil} days left</span>;
    }
  };

  // Navigate to individual pageant applications
  const viewPageantApplications = (pageantId) => {
    navigate(`/organization-dashboard/applications/${pageantId}`);
  };

  // Filter and sort options
  const filterOptions = [
    { value: 'all', label: 'All Pageants' },
    { value: 'pending', label: 'Has Pending Applications' },
    { value: 'urgent', label: 'Urgent (≤7 days)' },
    { value: 'active', label: 'Active Registration' }
  ];

  const sortOptions = [
    { value: 'deadline', label: 'Registration Deadline' },
    { value: 'pending', label: 'Most Pending Applications' },
    { value: 'applications', label: 'Most Total Applications' },
    { value: 'name', label: 'Pageant Name (A-Z)' }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading applications..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="application-management">
      <DashboardPageHeader 
        title="Application Management"
        subtitle="Review and approve contestant applications for your pageants"
      />

      {/* Summary Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            icon={faClipboardCheck}
            value={totalPendingApplications}
            label="Pending Applications"
            className={totalPendingApplications > 0 ? 'border-warning' : ''}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            icon={faClock}
            value={urgentPageants}
            label="Urgent Deadlines"
            className={urgentPageants > 0 ? 'border-danger' : ''}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            icon={faTrophy}
            value={activePageants}
            label="Active Pageants"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            icon={faUsers}
            value={totalApplications}
            label="Total Applications"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        sortOptions={sortOptions}
        selectedSort={sortBy}
        onSortChange={setSortBy}
        placeholder="Search pageants..."
      />

      {/* Pageants List */}
      {filteredPageants.length === 0 ? (
        <EmptyState 
          icon={faExclamationTriangle}
          title="No Pageants Found"
          message={searchTerm || statusFilter !== 'all' 
            ? "No pageants match your current search or filter criteria."
            : "You don't have any pageants with applications yet."
          }
          variant="info"
        />
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Pageant Details</th>
                    <th>Registration Deadline</th>
                    <th>Applications Status</th>
                    <th>Location & Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPageants.map((pageant) => (
                    <tr key={pageant._id} className={getUrgencyLevel(pageant.daysUntilDeadline) === 'critical' ? 'table-danger' : getUrgencyLevel(pageant.daysUntilDeadline) === 'urgent' ? 'table-warning' : ''}>
                      <td>
                        <div className="pageant-info">
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faTrophy} className="me-3 text-primary" />
                            <div>
                              <div className="fw-bold">{pageant.name}</div>
                              <small className="text-muted">
                                ID: {pageant.pageantID} | {formatDate(pageant.startDate)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="deadline-info">
                          <div className="d-flex align-items-center mb-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                            <span>{formatDate(pageant.registrationDeadline)}</span>
                          </div>
                          {getUrgencyBadge(pageant.daysUntilDeadline)}
                        </div>
                      </td>
                      
                      <td>
                        <div className="applications-status">
                          <div className="row g-2 text-center">
                            <div className="col-4">
                              <div className="small-stat pending">
                                <div className="stat-number text-warning">{pageant.pendingApplications}</div>
                                <div className="stat-label">Pending</div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="small-stat approved">
                                <div className="stat-number text-success">{pageant.approvedApplications}</div>
                                <div className="stat-label">Approved</div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="small-stat rejected">
                                <div className="stat-number text-danger">{pageant.rejectedApplications}</div>
                                <div className="stat-label">Rejected</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <small className="text-muted">Total: {pageant.totalApplications}</small>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="location-fee">
                          <div className="mb-1">
                            <small className="text-muted">Location:</small><br />
                            <span>{pageant.location.address.city}, {pageant.location.address.state}</span>
                          </div>
                          <div>
                            <FontAwesomeIcon icon={faMoneyBillWave} className="me-1 text-success" />
                            <span className="fw-bold">{formatCurrency(pageant.entryFee.amount)}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="actions-column">
                          <button
                            className={`btn btn-sm w-100 ${pageant.pendingApplications > 0 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => viewPageantApplications(pageant._id)}
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            Review Applications
                            {pageant.pendingApplications > 0 && (
                              <span className="badge bg-warning text-dark ms-2">
                                {pageant.pendingApplications}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Summary */}
      {totalPendingApplications > 0 && (
        <div className="card mt-4 border-warning">
          <div className="card-header bg-warning bg-opacity-10">
            <h6 className="card-title mb-0 text-warning">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Action Required
            </h6>
          </div>
          <div className="card-body">
            <p className="mb-3">
              You have <strong>{totalPendingApplications}</strong> pending applications 
              that need your review across {pageants.filter(p => p.pendingApplications > 0).length} pageants.
            </p>
            <div className="row g-3">
              {pageants
                .filter(p => p.pendingApplications > 0)
                .slice(0, 3)
                .map(pageant => (
                  <div key={pageant._id} className="col-md-4">
                    <div className="quick-action-card p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{pageant.name}</span>
                        <span className="badge bg-warning text-dark">
                          {pageant.pendingApplications}
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-warning w-100"
                        onClick={() => viewPageantApplications(pageant._id)}
                      >
                        Review Now
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faTrophy,
  faUsers,
  faChartLine,
  faCalendarAlt,
  faPlay,
  faPause,
  faStop,
  faEye,
  faEdit,
  faDownload,
  faPlus,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ScoringDashboard = () => {
  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPageants();
  }, []);

  const fetchPageants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the new scoring endpoint that handles all the logic
      const response = await fetch('/api/scoring/pageants', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view scoring dashboard');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view scoring data');
        } else {
          throw new Error(`Failed to fetch pageants: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load pageants');
      }
      
      setPageants(data.pageants || []);
    } catch (err) {
      console.error('Error fetching pageants:', err);
      setError(err.message || 'Failed to load pageants');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'in-progress': { class: 'bg-success', text: 'In Progress' },
      'published': { class: 'bg-primary', text: 'Published' },
      'completed': { class: 'bg-secondary', text: 'Completed' },
      'draft': { class: 'bg-warning text-dark', text: 'Draft' },
      'cancelled': { class: 'bg-danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getScoringStatusBadge = (status) => {
    const statusConfig = {
      'active': { class: 'bg-success', text: 'Scoring Active', icon: faPlay },
      'paused': { class: 'bg-warning text-dark', text: 'Paused', icon: faPause },
      'completed': { class: 'bg-info', text: 'Scoring Complete', icon: faStop },
      'pending': { class: 'bg-secondary', text: 'Not Started', icon: faCalendarAlt }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <FontAwesomeIcon icon={config.icon} className="me-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleViewScores = (pageantId) => {
    // Navigate to scores view
    window.location.href = `/organization-dashboard/scoring/pageant/${pageantId}/scores`;
  };

  const handleManageScoring = (pageantId) => {
    // Navigate to scoring management
    window.location.href = `/organization-dashboard/scoring/pageant/${pageantId}/manage`;
  };

  const handleLiveScoring = (pageantId) => {
    // Navigate to live scoring interface
    window.location.href = `/organization-dashboard/scoring/pageant/${pageantId}/live`;
  };

  const handleExportResults = async () => {
    try {
      // You can implement export functionality here
      alert('Export functionality will be implemented soon');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export results');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        {error}
      </div>
    );
  }

  // Calculate stats
  const activeScoring = pageants.filter(p => p.scoringStatus === 'active').length;
  const totalContestants = pageants.reduce((sum, p) => sum + (p.totalContestants || 0), 0);
  const completedPageants = pageants.filter(p => p.scoringStatus === 'completed').length;

  return (
    <div className="scoring-dashboard">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">
              <FontAwesomeIcon icon={faAward} className="me-3 text-warning" />
              Scoring & Results Dashboard
            </h2>
            <p className="text-muted">Manage pageant scoring, view results, and track progress</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={handleExportResults}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Export Results
            </button>
            <Link to="/organization-dashboard/scoring/live" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlay} className="me-2" />
              Start Live Scoring
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faTrophy} size="2x" className="text-warning mb-2" />
              <div className="h3 mb-1">{pageants.length}</div>
              <div className="text-muted">Total Pageants</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faPlay} size="2x" className="text-success mb-2" />
              <div className="h3 mb-1">{activeScoring}</div>
              <div className="text-muted">Active Scoring</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faUsers} size="2x" className="text-info mb-2" />
              <div className="h3 mb-1">{totalContestants}</div>
              <div className="text-muted">Total Contestants</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faChartLine} size="2x" className="text-primary mb-2" />
              <div className="h3 mb-1">{completedPageants}</div>
              <div className="text-muted">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pageants */}
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Pageant Scoring Status</h5>
          <Link to="/organization-dashboard/organizations" className="btn btn-sm btn-outline-primary">
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            New Pageant
          </Link>
        </div>
        <div className="card-body p-0">
          {pageants.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faTrophy} size="3x" className="text-muted mb-3" />
              <h4>No Pageants Available for Scoring</h4>
              <p className="text-muted">Create a pageant to start managing scores and results</p>
              <Link to="/organization-dashboard/organizations" className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create Your First Pageant
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Pageant</th>
                    <th>Status</th>
                    <th>Dates</th>
                    <th>Progress</th>
                    <th>Contestants</th>
                    <th>Scoring Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageants.map((pageant) => (
                    <tr key={pageant._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faTrophy} className="me-3 text-warning" />
                          <div>
                            <div className="fw-bold">{pageant.name}</div>
                            {pageant.currentCategory && (
                              <small className="text-muted">Current: {pageant.currentCategory}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(pageant.status)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                          <div>
                            <div>{formatDate(pageant.startDate)}</div>
                            <small className="text-muted">to {formatDate(pageant.endDate)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-container">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Categories</small>
                            <small className="text-muted">
                              {pageant.categoriesCompleted || 0}/{pageant.totalCategories || 0}
                            </small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${getProgressPercentage(pageant.categoriesCompleted || 0, pageant.totalCategories || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faUsers} className="me-2 text-muted" />
                          <span>{pageant.totalContestants || 0}</span>
                        </div>
                      </td>
                      <td>
                        {getScoringStatusBadge(pageant.scoringStatus || 'pending')}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            title="View Scores"
                            onClick={() => handleViewScores(pageant._id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            title="Manage Scoring"
                            onClick={() => handleManageScoring(pageant._id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          {pageant.scoringStatus === 'active' && (
                            <button 
                              className="btn btn-sm btn-success"
                              title="Live Scoring"
                              onClick={() => handleLiveScoring(pageant._id)}
                            >
                              <FontAwesomeIcon icon={faPlay} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faPlay} size="3x" className="text-success mb-3" />
              <h5>Start Live Scoring</h5>
              <p className="text-muted">Begin real-time scoring for active pageants</p>
              <Link to="/organization-dashboard/scoring/live" className="btn btn-success">
                Launch Scoring Interface
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faChartLine} size="3x" className="text-info mb-3" />
              <h5>View Results</h5>
              <p className="text-muted">Review completed pageant results and rankings</p>
              <Link to="/organization-dashboard/scoring/results" className="btn btn-info text-white">
                View All Results
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faDownload} size="3x" className="text-warning mb-3" />
              <h5>Export Data</h5>
              <p className="text-muted">Download scores, results, and analytics</p>
              <button className="btn btn-warning" onClick={handleExportResults}>
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringDashboard;
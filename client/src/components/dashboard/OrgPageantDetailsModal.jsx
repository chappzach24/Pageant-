// client/src/components/dashboard/PageantDetailsModal.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faLocationDot,
  faUsers,
  faMoneyBillWave,
  faTrophy,
  faClipboardList,
  faCheck,
  faTimes,
  faEdit,
  faInfoCircle,
  faBuilding,
  faGlobe,
  faIdCard,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const OrgPageantDetailsModal = ({ pageant, isOpen, onClose, onEdit, orgName }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Return null if modal should not be shown
  if (!isOpen || !pageant) return null;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    let className = '';
    
    switch (status) {
      case 'draft':
        className = 'bg-secondary';
        break;
      case 'published':
        className = 'bg-success';
        break;
      case 'registration-closed':
        className = 'bg-warning text-dark';
        break;
      case 'in-progress':
        className = 'bg-primary';
        break;
      case 'completed':
        className = 'bg-info text-dark';
        break;
      case 'cancelled':
        className = 'bg-danger';
        break;
      default:
        className = 'bg-secondary';
    }
    
    return <span className={`badge ${className}`}>{status.replace('-', ' ')}</span>;
  };
  
  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div className="modal-dialog modal-xl m-0" onClick={e => e.stopPropagation()} style={{
        maxWidth: '90%',
        width: '1200px',
        maxHeight: '90vh',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 1051
      }}>
        <div className="modal-content" style={{
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0.5rem',
        }}>
          {/* Modal Header */}
          <div className="modal-header">
            <div>
              <h5 className="modal-title">{pageant.name}</h5>
              <div className="d-flex align-items-center">
                <span className="me-2">{getStatusBadge(pageant.status)}</span>
                <small className="text-muted">ID: {pageant.pageantID}</small>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          {/* Modal Navigation Tabs */}
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                Categories
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'contestants' ? 'active' : ''}`}
                onClick={() => setActiveTab('contestants')}
              >
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Contestants
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'prizes' ? 'active' : ''}`}
                onClick={() => setActiveTab('prizes')}
              >
                <FontAwesomeIcon icon={faTrophy} className="me-2" />
                Prizes
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistics')}
              >
                <FontAwesomeIcon icon={faChartBar} className="me-2" />
                Statistics
              </button>
            </li>
          </ul>
          
          {/* Modal Body with Tab Content */}
          <div className="modal-body" style={{ overflowY: 'auto' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">Basic Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">Description:</div>
                          <div className="col-md-9">{pageant.description}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faBuilding} className="me-2" />
                            Organization:
                          </div>
                          <div className="col-md-9">
                            {typeof orgName === 'string' 
                              ? orgName 
                              : 'Unknown Organization'}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            Start Date:
                          </div>
                          <div className="col-md-9">{formatDate(pageant.startDate)}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            End Date:
                          </div>
                          <div className="col-md-9">{formatDate(pageant.endDate)}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            Registration Deadline:
                          </div>
                          <div className="col-md-9">{formatDate(pageant.registrationDeadline)}</div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                            Location:
                          </div>
                          <div className="col-md-9">
                            {pageant.location?.venue ? (
                              <>
                                {pageant.location.venue}
                                {pageant.location.address?.city && (
                                  <>, {pageant.location.address.city}</>
                                )}
                                {pageant.location.address?.state && (
                                  <>, {pageant.location.address.state}</>
                                )}
                                {pageant.location.virtual && (
                                  <span className="badge bg-info ms-2">Virtual</span>
                                )}
                              </>
                            ) : (
                              pageant.location?.virtual ? 'Virtual Event' : 'Location not specified'
                            )}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-3 fw-bold">
                            <FontAwesomeIcon icon={faGlobe} className="me-2" />
                            Visibility:
                          </div>
                          <div className="col-md-9">
                            {pageant.isPublic ? (
                              <span className="text-success">
                                <FontAwesomeIcon icon={faCheck} className="me-1" />
                                Public
                              </span>
                            ) : (
                              <span className="text-danger">
                                <FontAwesomeIcon icon={faTimes} className="me-1" />
                                Private
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">Registration Details</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="fw-bold mb-1">
                            <FontAwesomeIcon icon={faIdCard} className="me-2" />
                            Competition Year:
                          </div>
                          <div>{pageant.competitionYear}</div>
                        </div>
                        <div className="mb-3">
                          <div className="fw-bold mb-1">
                            <FontAwesomeIcon icon={faUsers} className="me-2" />
                            Max Participants:
                          </div>
                          <div>
                            {pageant.maxParticipants > 0 
                              ? pageant.maxParticipants 
                              : 'Unlimited'}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="fw-bold mb-1">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                            Entry Fee:
                          </div>
                          <div>
                            {formatCurrency(
                              pageant.entryFee?.amount, 
                              pageant.entryFee?.currency
                            )}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="fw-bold mb-1">Age Groups:</div>
                          <div>
                            {pageant.ageGroups && pageant.ageGroups.length > 0 ? (
                              <div className="d-flex flex-wrap gap-2">
                                {pageant.ageGroups.map((ageGroup, index) => (
                                  <span className="badge bg-light text-dark" key={index}>
                                    {ageGroup}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              'No age groups specified'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/*<div className="d-flex justify-content-end mt-3">
                  {onEdit && (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onEdit(pageant._id)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Edit Pageant
                    </button>
                  )} 
                </div>*/}
              </div>
            )}
            
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="tab-content">
                <h5 className="mb-4">Pageant Categories</h5>
                
                {pageant.categories && pageant.categories.length > 0 ? (
                  <div className="row">
                    {pageant.categories.map((category, index) => (
                      <div className="col-md-6 mb-4" key={index}>
                        <div className="card h-100">
                          <div className="card-header">
                            <h6 className="mb-0">
                              {typeof category === 'string' 
                                ? category 
                                : category.name}
                            </h6>
                          </div>
                          <div className="card-body">
                            {typeof category !== 'string' && (
                              <>
                                <p>{category.description || 'No description provided.'}</p>
                                {category.price > 0 && (
                                  <div className="mb-3">
                                    <strong>Additional Fee:</strong> {formatCurrency(category.price)}
                                  </div>
                                )}
                                {category.scoringCriteria && category.scoringCriteria.length > 0 && (
                                  <div>
                                    <strong>Scoring Criteria:</strong>
                                    <ul className="mt-2">
                                      {category.scoringCriteria.map((criteria, idx) => (
                                        <li key={idx}>
                                          {criteria.name} 
                                          {criteria.maxScore && ` (Max: ${criteria.maxScore} points)`}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    No categories have been defined for this pageant.
                  </div>
                )}
              </div>
            )}
            
            {/* Contestants Tab */}
            {activeTab === 'contestants' && (
              <div className="tab-content">
                <h5 className="mb-4">Registered Contestants</h5>
                
                <div className="alert alert-info mb-4">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  This section will display registered contestants once available.
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <p className="mb-0">
                      Registration Status: 
                      {pageant.status === 'published' ? (
                        <span className="text-success ms-2">Open for Registration</span>
                      ) : (
                        <span className="text-secondary ms-2">Registration {pageant.status}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div className="tab-content">
                <h5 className="mb-4">Pageant Prizes</h5>
                
                {pageant.prizes && pageant.prizes.length > 0 ? (
                  <div className="row">
                    {pageant.prizes.map((prize, index) => (
                      <div className="col-md-6 mb-4" key={index}>
                        <div className="card h-100">
                          <div className="card-header">
                            <h6 className="mb-0">{prize.title}</h6>
                          </div>
                          <div className="card-body">
                            <p>{prize.description || 'No description provided.'}</p>
                            <div className="mb-2">
                              <strong>Value:</strong> {formatCurrency(prize.value)}
                            </div>
                            <div>
                              <strong>For Age Group:</strong> {prize.forAgeGroup || 'All'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    No prizes have been defined for this pageant.
                  </div>
                )}
              </div>
            )}
            
            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
              <div className="tab-content">
                <h5 className="mb-4">Pageant Statistics</h5>
                
                <div className="alert alert-info mb-4">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Detailed statistics will be available once contestants register for the pageant.
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">Registration Summary</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Registered Contestants:</span>
                          <span>0</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Maximum Capacity:</span>
                          <span>
                            {pageant.maxParticipants > 0 
                              ? pageant.maxParticipants 
                              : 'Unlimited'}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Registration Open Until:</span>
                          <span>{formatDate(pageant.registrationDeadline)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">Categories Summary</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Categories:</span>
                          <span>{pageant.categories?.length || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Age Groups:</span>
                          <span>{pageant.ageGroups?.length || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Prizes:</span>
                          <span>{pageant.prizes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div 
            className="modal-footer" 
            style={{
                padding: '1rem 3rem',
            }}>
            <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}  
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrgPageantDetailsModal.propTypes = {
  pageant: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  orgName: PropTypes.string
};

export default OrgPageantDetailsModal;
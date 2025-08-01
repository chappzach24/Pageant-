import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUserCheck,
  faUserTimes,
  faEye,
  faCheck,
  faTimes,
  faSpinner,
  faCalendarAlt,
  faLocationDot,
  faMoneyBillWave,
  faUser,
  faPhone,
  faEnvelope,
  faIdCard,
  faNotesMedical,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faFilter,
  faSort,
  faDownload,
  faClock,
  faInfoCircle,
  faUsers,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  ActionButton,
  TabNavigation
} from '../../components/dashboard/common';

// Import utilities
import { formatDate, formatCurrency } from '../../utils';

// Import CSS
import '../../css/applicationManagement.css';

const PageantApplications = () => {
  const { pageantId } = useParams();
  const navigate = useNavigate();
  
  const [pageantData, setPageantData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingApplications, setProcessingApplications] = useState(new Set());
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch pageant data and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock pageant data
        const mockPageantData = {
          _id: pageantId,
          name: 'Miss Spring Festival 2025',
          pageantID: 'SPF2025-001',
          startDate: '2025-04-15',
          endDate: '2025-04-16',
          registrationDeadline: '2025-03-15',
          entryFee: { amount: 125, currency: 'USD' },
          location: {
            venue: 'Grand Ballroom',
            address: { 
              street: '123 Main St',
              city: 'Columbus', 
              state: 'OH',
              zipCode: '43215'
            }
          },
          categories: ['Evening Gown', 'Talent', 'Interview', 'Swimwear'],
          ageGroups: ['13 - 18 Years', '19 - 39 Years'],
          status: 'published'
        };

        // Mock applications data
        const mockApplications = [
          {
            _id: 'app1',
            contestant: {
              _id: 'user1',
              firstName: 'Emma',
              lastName: 'Johnson',
              email: 'emma.johnson@email.com',
              username: 'emmaj2010',
              dateOfBirth: '2010-03-15',
              ageGroup: '13 - 18 Years',
              phone: '(555) 123-4567'
            },
            profile: {
              biography: 'I love dancing and have been competing in pageants for 3 years.',
              emergencyContact: {
                name: 'Sarah Johnson',
                relationship: 'Mother',
                phone: '(555) 123-4567'
              },
              medicalInformation: {
                allergies: 'None',
                medicalConditions: 'None'
              }
            },
            categories: ['Evening Gown', 'Talent', 'Interview'],
            appliedAt: '2025-02-01T10:30:00Z',
            status: 'pending',
            paymentStatus: 'completed',
            paymentAmount: 125,
            photos: {
              headshot: 'url-to-headshot',
              fullBody: 'url-to-fullbody'
            },
            notes: ''
          },
          {
            _id: 'app2',
            contestant: {
              _id: 'user2',
              firstName: 'Sophia',
              lastName: 'Davis',
              email: 'sophia.davis@email.com',
              username: 'sophiad15',
              dateOfBirth: '2015-07-22',
              ageGroup: '9 - 12 Years',
              phone: '(555) 234-5678'
            },
            profile: {
              biography: 'I enjoy singing and playing piano.',
              emergencyContact: {
                name: 'Michael Davis',
                relationship: 'Father',
                phone: '(555) 234-5678'
              },
              medicalInformation: {
                allergies: 'Peanuts',
                medicalConditions: 'None'
              }
            },
            categories: ['Talent', 'Interview'],
            appliedAt: '2025-01-28T14:20:00Z',
            status: 'pending',
            paymentStatus: 'completed',
            paymentAmount: 85,
            photos: {
              headshot: 'url-to-headshot',
              fullBody: 'url-to-fullbody'
            },
            notes: ''
          },
          {
            _id: 'app3',
            contestant: {
              _id: 'user3',
              firstName: 'Isabella',
              lastName: 'Martinez',
              email: 'isabella.martinez@email.com',
              username: 'bella_m',
              dateOfBirth: '2008-11-05',
              ageGroup: '13 - 18 Years',
              phone: '(555) 345-6789'
            },
            profile: {
              biography: 'Passionate about community service and public speaking.',
              emergencyContact: {
                name: 'Maria Martinez',
                relationship: 'Mother',
                phone: '(555) 345-6789'
              },
              medicalInformation: {
                allergies: 'None',
                medicalConditions: 'None'
              }
            },
            categories: ['Evening Gown', 'Talent', 'Interview', 'Swimwear'],
            appliedAt: '2025-01-25T09:15:00Z',
            status: 'approved',
            paymentStatus: 'completed',
            paymentAmount: 125,
            photos: {
              headshot: 'url-to-headshot',
              fullBody: 'url-to-fullbody'
            },
            notes: 'Excellent application, strong experience in pageants.'
          },
          {
            _id: 'app4',
            contestant: {
              _id: 'user4',
              firstName: 'Olivia',
              lastName: 'Wilson',
              email: 'olivia.wilson@email.com',
              username: 'livwilson',
              dateOfBirth: '2012-09-12',
              ageGroup: '9 - 12 Years',
              phone: '(555) 456-7890'
            },
            profile: {
              emergencyContact: {
                name: 'Jennifer Wilson',
                relationship: 'Mother',
                phone: '(555) 456-7890'
              },
              medicalInformation: {
                allergies: 'Shellfish',
                medicalConditions: 'Asthma'
              }
            },
            categories: ['Evening Gown', 'Interview'],
            appliedAt: '2025-01-20T16:45:00Z',
            status: 'rejected',
            paymentStatus: 'refunded',
            paymentAmount: 100,
            photos: {
              headshot: 'url-to-headshot',
              fullBody: 'url-to-fullbody'
            },
            notes: 'Did not meet age requirements for selected categories.'
          }
        ];

        setPageantData(mockPageantData);
        setApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load pageant applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (pageantId) {
      fetchData();
    }
  }, [pageantId]);

  // Filter applications by status
  const getFilteredApplications = () => {
    let filtered = applications.filter(app => {
      if (activeTab === 'all') return true;
      return app.status === activeTab;
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.contestant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contestant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contestant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contestant.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.appliedAt) - new Date(a.appliedAt);
        case 'oldest':
          return new Date(a.appliedAt) - new Date(b.appliedAt);
        case 'name':
          return `${a.contestant.firstName} ${a.contestant.lastName}`.localeCompare(
            `${b.contestant.firstName} ${b.contestant.lastName}`
          );
        case 'ageGroup':
          return a.contestant.ageGroup.localeCompare(b.contestant.ageGroup);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Handle application approval/rejection
  const handleApplicationDecision = async (applicationId, decision, notes = '') => {
    setProcessingApplications(prev => new Set([...prev, applicationId]));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update application status
      setApplications(prev => prev.map(app => 
        app._id === applicationId 
          ? { ...app, status: decision, notes: notes || app.notes }
          : app
      ));

      // Success feedback could be added here
    } catch (error) {
      console.error('Error updating application:', error);
      setError(`Failed to ${decision} application. Please try again.`);
    } finally {
      setProcessingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  // Bulk actions
  const handleBulkApproval = async () => {
    const pendingApps = applications.filter(app => app.status === 'pending');
    
    for (const app of pendingApps) {
      await handleApplicationDecision(app._id, 'approved');
    }
  };

  // View application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-warning text-dark', icon: faClock, text: 'Pending Review' },
      approved: { bg: 'bg-success', icon: faCheckCircle, text: 'Approved' },
      rejected: { bg: 'bg-danger', icon: faTimesCircle, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`badge ${config.bg}`}>
        <FontAwesomeIcon icon={config.icon} className="me-1" />
        {config.text}
      </span>
    );
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Tab configuration
  const tabs = [
    {
      id: 'pending',
      label: 'Pending Review',
      icon: faClock,
      badge: applications.filter(app => app.status === 'pending').length
    },
    {
      id: 'approved',
      label: 'Approved',
      icon: faCheckCircle,
      badge: applications.filter(app => app.status === 'approved').length
    },
    {
      id: 'rejected',
      label: 'Rejected',
      icon: faTimesCircle,
      badge: applications.filter(app => app.status === 'rejected').length
    },
    {
      id: 'all',
      label: 'All Applications',
      icon: faUsers,
      badge: applications.length
    }
  ];

  const filteredApplications = getFilteredApplications();

  if (loading) {
    return <LoadingSpinner text="Loading pageant applications..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!pageantData) {
    return <EmptyState message="Pageant not found" />;
  }

  return (
    <div className="pageant-applications">
      <DashboardPageHeader 
        title={`Applications: ${pageantData.name}`}
        subtitle={`Pageant ID: ${pageantData.pageantID} | Registration deadline: ${formatDate(pageantData.registrationDeadline)}`}
      >
        <ActionButton
          variant="outline-secondary"
          icon={faArrowLeft}
          onClick={() => navigate('/organization-dashboard/applications')}
        >
          Back to Applications
        </ActionButton>
      </DashboardPageHeader>

      {/* Pageant Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-muted" size="lg" />
                <div>
                  <strong>Event Date:</strong><br />
                  {formatDate(pageantData.startDate)}
                  {pageantData.endDate !== pageantData.startDate && ` - ${formatDate(pageantData.endDate)}`}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <FontAwesomeIcon icon={faLocationDot} className="me-3 text-muted" size="lg" />
                <div>
                  <strong>Location:</strong><br />
                  {pageantData.location.venue}<br />
                  <small className="text-muted">
                    {pageantData.location.address.city}, {pageantData.location.address.state}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <FontAwesomeIcon icon={faMoneyBillWave} className="me-3 text-muted" size="lg" />
                <div>
                  <strong>Entry Fee:</strong><br />
                  {formatCurrency(pageantData.entryFee.amount)}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <FontAwesomeIcon icon={faTrophy} className="me-3 text-muted" size="lg" />
                <div>
                  <strong>Categories:</strong><br />
                  <small>{pageantData.categories.join(', ')}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search and Sort Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search contestants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Applications</option>
                <option value="oldest">Oldest Applications</option>
                <option value="name">Name (A-Z)</option>
                <option value="ageGroup">Age Group</option>
              </select>
            </div>
            <div className="col-md-3">
              {activeTab === 'pending' && applications.filter(app => app.status === 'pending').length > 0 && (
                <ActionButton
                  variant="success"
                  className="w-100"
                  onClick={handleBulkApproval}
                  icon={faCheckCircle}
                >
                  Approve All Pending
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState 
          icon={faExclamationTriangle}
          title="No Applications Found"
          message={searchTerm 
            ? "No applications match your search criteria."
            : `No ${activeTab === 'all' ? '' : activeTab} applications found for this pageant.`
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
                    <th>Contestant</th>
                    <th>Age Group</th>
                    <th>Categories</th>
                    <th>Applied Date</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <div className="contestant-info">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-3">
                              {application.contestant.firstName.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold">
                                {application.contestant.firstName} {application.contestant.lastName}
                              </div>
                              <small className="text-muted">
                                @{application.contestant.username}
                              </small>
                              <div>
                                <small className="text-muted">
                                  Age: {calculateAge(application.contestant.dateOfBirth)}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <span className="badge bg-light text-dark">
                          {application.contestant.ageGroup}
                        </span>
                      </td>
                      
                      <td>
                        <div className="categories-list">
                          {application.categories.map((category, index) => (
                            <span key={index} className="badge bg-primary me-1 mb-1">
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      <td>
                        <div>
                          {formatDate(application.appliedAt)}
                        </div>
                        <small className="text-muted">
                          {new Date(application.appliedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      
                      <td>
                        <div>
                          <div className="fw-bold">{formatCurrency(application.paymentAmount)}</div>
                          <span className={`badge ${
                            application.paymentStatus === 'completed' ? 'bg-success' :
                            application.paymentStatus === 'refunded' ? 'bg-info' : 'bg-warning text-dark'
                          }`}>
                            {application.paymentStatus}
                          </span>
                        </div>
                      </td>
                      
                      <td>
                        {getStatusBadge(application.status)}
                      </td>
                      
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewApplicationDetails(application)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          
                          {application.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApplicationDecision(application._id, 'approved')}
                                disabled={processingApplications.has(application._id)}
                                title="Approve Application"
                              >
                                {processingApplications.has(application._id) ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <FontAwesomeIcon icon={faCheck} />
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleApplicationDecision(application._id, 'rejected')}
                                disabled={processingApplications.has(application._id)}
                                title="Reject Application"
                              >
                                {processingApplications.has(application._id) ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <FontAwesomeIcon icon={faTimes} />
                                )}
                              </button>
                            </>
                          )}
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

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Application Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Personal Information</h6>
                    <div className="mb-3">
                      <strong>Full Name:</strong><br />
                      {selectedApplication.contestant.firstName} {selectedApplication.contestant.lastName}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong><br />
                      {selectedApplication.contestant.email}
                    </div>
                    <div className="mb-3">
                      <strong>Phone:</strong><br />
                      {selectedApplication.contestant.phone}
                    </div>
                    <div className="mb-3">
                      <strong>Date of Birth:</strong><br />
                      {formatDate(selectedApplication.contestant.dateOfBirth)} 
                      (Age: {calculateAge(selectedApplication.contestant.dateOfBirth)})
                    </div>
                    <div className="mb-3">
                      <strong>Age Group:</strong><br />
                      {selectedApplication.contestant.ageGroup}
                    </div>
                    
                    <h6 className="fw-bold mb-3 mt-4">Emergency Contact</h6>
                    <div className="mb-3">
                      <strong>Name:</strong><br />
                      {selectedApplication.profile.emergencyContact?.name || 'Not provided'}
                    </div>
                    <div className="mb-3">
                      <strong>Relationship:</strong><br />
                      {selectedApplication.profile.emergencyContact?.relationship || 'Not provided'}
                    </div>
                    <div className="mb-3">
                      <strong>Phone:</strong><br />
                      {selectedApplication.profile.emergencyContact?.phone || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Application Details</h6>
                    <div className="mb-3">
                      <strong>Applied Date:</strong><br />
                      {formatDate(selectedApplication.appliedAt)}
                    </div>
                    <div className="mb-3">
                      <strong>Categories:</strong><br />
                      {selectedApplication.categories.map((cat, idx) => (
                        <span key={idx} className="badge bg-primary me-1 mb-1">{cat}</span>
                      ))}
                    </div>
                    <div className="mb-3">
                      <strong>Payment Status:</strong><br />
                      <span className={`badge ${
                        selectedApplication.paymentStatus === 'completed' ? 'bg-success' :
                        selectedApplication.paymentStatus === 'refunded' ? 'bg-info' : 'bg-warning text-dark'
                      }`}>
                        {selectedApplication.paymentStatus}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Payment Amount:</strong><br />
                      {formatCurrency(selectedApplication.paymentAmount)}
                    </div>
                    
                    <h6 className="fw-bold mb-3 mt-4">Medical Information</h6>
                    <div className="mb-3">
                      <strong>Allergies:</strong><br />
                      {selectedApplication.profile.medicalInformation?.allergies || 'Not provided'}
                    </div>
                    <div className="mb-3">
                      <strong>Medical Conditions:</strong><br />
                      {selectedApplication.profile.medicalInformation?.medicalConditions || 'Not provided'}
                    </div>
                    
                    {selectedApplication.profile.biography && (
                      <>
                        <h6 className="fw-bold mb-3 mt-4">Biography</h6>
                        <p>{selectedApplication.profile.biography}</p>
                      </>
                    )}
                    
                    {selectedApplication.notes && (
                      <>
                        <h6 className="fw-bold mb-3 mt-4">Notes</h6>
                        <p className="text-muted">{selectedApplication.notes}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedApplication.status === 'pending' && (
                  <>
                    <ActionButton
                      variant="success"
                      icon={faCheck}
                      onClick={() => {
                        handleApplicationDecision(selectedApplication._id, 'approved');
                        setShowDetailsModal(false);
                      }}
                      loading={processingApplications.has(selectedApplication._id)}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      icon={faTimes}
                      onClick={() => {
                        handleApplicationDecision(selectedApplication._id, 'rejected');
                        setShowDetailsModal(false);
                      }}
                      loading={processingApplications.has(selectedApplication._id)}
                    >
                      Reject
                    </ActionButton>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageantApplications;
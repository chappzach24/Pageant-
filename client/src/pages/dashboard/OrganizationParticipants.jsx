// client/src/pages/dashboard/OrganizationParticipants.jsx
import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faUser,
  faDownload,
  faFileExport,
  faExclamationTriangle,
  faEdit,
  faIdCard,
  faTrophy,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  SearchFilterBar 
} from '../../components/dashboard/common';

// Import custom hook for data fetching
import { useAuth } from '../../context/AuthContext';

// Import utilities
import { formatDate, formatCurrency } from '../../utils';

// Import CSS
import '../../css/organizationParticipants.css';

// Add to main.jsx router:
// {
//   path: "participants",
//   element: <OrganizationParticipants />,
// },

const OrganizationParticipants = () => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPageant, setSelectedPageant] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pageants, setPageants] = useState([]);

  // Mock data for now - will be replaced with API call later
  useEffect(() => {
    const loadMockData = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Mock pageants data
        const mockPageants = [
          {
            _id: 'pageant1',
            name: 'Miss Spring Festival 2025',
            startDate: '2025-04-15',
            endDate: '2025-04-16'
          },
          {
            _id: 'pageant2', 
            name: 'Teen Miss Summer 2025',
            startDate: '2025-06-20',
            endDate: '2025-06-21'
          },
          {
            _id: 'pageant3',
            name: 'Little Miss Sunshine 2025', 
            startDate: '2025-08-10',
            endDate: '2025-08-11'
          }
        ];

        // Mock participants data
        const mockParticipants = [
          {
            _id: 'part1',
            user: {
              firstName: 'Emma',
              lastName: 'Johnson',
              email: 'emma.johnson@email.com',
              username: 'emmaj2010',
              dateOfBirth: '2010-03-15',
              ageGroup: '13 - 18 Years'
            },
            profile: {
              phone: '(555) 123-4567',
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
            pageant: mockPageants[0],
            categories: [
              { category: 'Evening Gown' },
              { category: 'Talent' },
              { category: 'Interview' }
            ],
            registrationDate: '2025-02-01',
            paymentStatus: 'completed',
            paymentAmount: 125
          },
          {
            _id: 'part2',
            user: {
              firstName: 'Sophia',
              lastName: 'Davis',
              email: 'sophia.davis@email.com',
              username: 'sophiad15',
              dateOfBirth: '2015-07-22',
              ageGroup: '9 - 12 Years'
            },
            profile: {
              phone: '(555) 234-5678',
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
            pageant: mockPageants[1],
            categories: [
              { category: 'Talent' },
              { category: 'Casual Wear' }
            ],
            registrationDate: '2025-01-28',
            paymentStatus: 'pending',
            paymentAmount: 85
          },
          {
            _id: 'part3',
            user: {
              firstName: 'Isabella',
              lastName: 'Martinez',
              email: 'isabella.martinez@email.com',
              username: 'bella_m',
              dateOfBirth: '2018-11-05',
              ageGroup: '5 - 8 Years'
            },
            profile: {
              phone: '(555) 345-6789',
              biography: 'I love to dance and make new friends!',
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
            pageant: mockPageants[2],
            categories: [
              { category: 'Talent' },
              { category: 'Photogenic' }
            ],
            registrationDate: '2025-02-05',
            paymentStatus: 'completed',
            paymentAmount: 75
          },
          {
            _id: 'part4',
            user: {
              firstName: 'Olivia',
              lastName: 'Wilson',
              email: 'olivia.wilson@email.com',
              username: 'livwilson',
              dateOfBirth: '2012-09-12',
              ageGroup: '9 - 12 Years'
            },
            profile: {
              phone: '(555) 456-7890',
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
            pageant: mockPageants[0],
            categories: [
              { category: 'Evening Gown' },
              { category: 'Interview' }
            ],
            registrationDate: '2025-01-30',
            paymentStatus: 'partial',
            paymentAmount: 100
          },
          {
            _id: 'part5',
            user: {
              firstName: 'Mia',
              lastName: 'Anderson',
              email: 'mia.anderson@email.com',
              username: 'mia_pageant',
              dateOfBirth: '2007-04-18',
              ageGroup: '13 - 18 Years'
            },
            profile: {
              phone: '(555) 567-8901',
              biography: 'Passionate about community service and public speaking.',
              emergencyContact: {
                name: 'David Anderson',
                relationship: 'Father',
                phone: '(555) 567-8901'
              },
              medicalInformation: {
                allergies: 'None',
                medicalConditions: 'None'
              }
            },
            pageant: mockPageants[1],
            categories: [
              { category: 'Evening Gown' },
              { category: 'Talent' },
              { category: 'Interview' },
              { category: 'Swimwear' }
            ],
            registrationDate: '2025-01-25',
            paymentStatus: 'completed',
            paymentAmount: 150
          },
          {
            _id: 'part6',
            user: {
              firstName: 'Charlotte',
              lastName: 'Brown',
              email: 'charlotte.brown@email.com',
              username: 'charlotte_b',
              dateOfBirth: '2016-12-03',
              ageGroup: '5 - 8 Years'
            },
            profile: {
              emergencyContact: {
                name: 'Lisa Brown',
                relationship: 'Mother',
                phone: '(555) 678-9012'
              },
              medicalInformation: {
                allergies: 'None',
                medicalConditions: 'None'
              }
            },
            pageant: mockPageants[2],
            categories: [
              { category: 'Photogenic' },
              { category: 'Talent' }
            ],
            registrationDate: '2025-02-03',
            paymentStatus: 'pending',
            paymentAmount: 75
          },
          {
            _id: 'part7',
            user: {
              firstName: 'Ava',
              lastName: 'Taylor',
              email: 'ava.taylor@email.com',
              username: 'ava_t2009',
              dateOfBirth: '2009-08-27',
              ageGroup: '13 - 18 Years'
            },
            profile: {
              phone: '(555) 789-0123',
              biography: 'I have been dancing since I was 4 years old and love performing.',
              emergencyContact: {
                name: 'Robert Taylor',
                relationship: 'Father',
                phone: '(555) 789-0123'
              },
              medicalInformation: {
                allergies: 'Latex',
                medicalConditions: 'None'
              }
            },
            pageant: mockPageants[0],
            categories: [
              { category: 'Talent' },
              { category: 'Evening Gown' }
            ],
            registrationDate: '2025-02-02',
            paymentStatus: 'pending',
            paymentAmount: 110
          },
          {
            _id: 'part8',
            user: {
              firstName: 'Grace',
              lastName: 'Lee',
              email: 'grace.lee@email.com',
              username: 'grace_lee',
              dateOfBirth: '2014-05-14',
              ageGroup: '9 - 12 Years'
            },
            profile: {
              phone: '(555) 890-1234',
              emergencyContact: {
                name: 'Amy Lee',
                relationship: 'Mother',
                phone: '(555) 890-1234'
              },
              medicalInformation: {
                allergies: 'None',
                medicalConditions: 'None'
              }
            },
            pageant: mockPageants[1],
            categories: [
              { category: 'Casual Wear' },
              { category: 'Interview' }
            ],
            registrationDate: '2025-01-27',
            paymentStatus: 'completed',
            paymentAmount: 90
          }
        ];

        setParticipants(mockParticipants);
        setPageants(mockPageants);
        setLoading(false);
      }, 1000); // 1 second delay to simulate loading
    };

    if (user) {
      loadMockData();
    }
  }, [user]);

  // Filter and sort participants
  const filteredAndSortedParticipants = useMemo(() => {
    let filtered = [...participants];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(participant => {
        const searchLower = searchTerm.toLowerCase();
        const user = participant.user || {};
        
        return (
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          participant.pageant?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Age group filter
    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(participant => 
        participant.user?.ageGroup === selectedAgeGroup
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(participant => 
        participant.paymentStatus === selectedStatus
      );
    }

    // Pageant filter
    if (selectedPageant !== 'all') {
      filtered = filtered.filter(participant => 
        participant.pageant?._id === selectedPageant
      );
    }

    // Sort participants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        case 'oldest':
          return new Date(a.registrationDate) - new Date(b.registrationDate);
        case 'name':
          const nameA = `${a.user?.firstName} ${a.user?.lastName}`.toLowerCase();
          const nameB = `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        case 'age':
          return (a.user?.age || 0) - (b.user?.age || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [participants, searchTerm, selectedAgeGroup, selectedStatus, selectedPageant, sortBy]);

  // Get unique age groups for filter
  const availableAgeGroups = useMemo(() => {
    const ageGroups = participants
      .map(p => p.user?.ageGroup)
      .filter(Boolean);
    return [...new Set(ageGroups)].sort();
  }, [participants]);

  // Get status counts
  const statusCounts = useMemo(() => {
    const counts = {
      all: participants.length,
      paid: participants.filter(p => p.paymentStatus === 'completed').length,
      pending: participants.filter(p => p.paymentStatus === 'pending').length,
      partial: participants.filter(p => p.paymentStatus === 'partial').length,
    };
    return counts;
  }, [participants]);

  // Filter options
  const ageGroupOptions = [
    { value: 'all', label: 'All Age Groups' },
    ...availableAgeGroups.map(group => ({ value: group, label: group }))
  ];

  const statusOptions = [
    { value: 'all', label: `All Status (${statusCounts.all})` },
    { value: 'completed', label: `Paid (${statusCounts.paid})` },
    { value: 'pending', label: `Pending (${statusCounts.pending})` },
    { value: 'partial', label: `Partial (${statusCounts.partial})` }
  ];

  const pageantOptions = [
    { value: 'all', label: 'All Pageants' },
    ...pageants.map(pageant => ({ value: pageant._id, label: pageant.name }))
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'age', label: 'Age (Youngest First)' }
  ];

  // Handle participant details modal
  const openDetailsModal = (participant) => {
    setSelectedParticipant(participant);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedParticipant(null);
  };

  // Export participants data
  const exportParticipants = () => {
    // Create CSV content
    const headers = [
      'Name',
      'Email',
      'Age Group',
      'Phone',
      'Emergency Contact',
      'Emergency Phone',
      'Pageant',
      'Registration Date',
      'Payment Status',
      'Amount'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedParticipants.map(participant => {
        const user = participant.user || {};
        const profile = participant.profile || {};
        const emergency = profile.emergencyContact || {};
        
        return [
          `"${user.firstName} ${user.lastName}"`,
          `"${user.email}"`,
          `"${user.ageGroup || 'N/A'}"`,
          `"${profile.phone || 'N/A'}"`,
          `"${emergency.name || 'N/A'}"`,
          `"${emergency.phone || 'N/A'}"`,
          `"${participant.pageant?.name || 'N/A'}"`,
          `"${formatDate(participant.registrationDate)}"`,
          `"${participant.paymentStatus || 'N/A'}"`,
          `"${participant.paymentAmount || 0}"`
        ].join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success', text: 'Paid' },
      pending: { bg: 'bg-warning text-dark', text: 'Pending' },
      partial: { bg: 'bg-info', text: 'Partial' },
      default: { bg: 'bg-secondary', text: 'Unknown' }
    };
    
    const config = statusConfig[status] || statusConfig.default;
    return <span className={`badge ${config.bg}`}>{config.text}</span>;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return <LoadingSpinner text="Loading participants..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="organization-participants">
      <DashboardPageHeader 
        title="Participants"
        subtitle="Manage all participants across your pageants"
      >
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={exportParticipants}
            disabled={filteredAndSortedParticipants.length === 0}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Export CSV
          </button>
        </div>
      </DashboardPageHeader>

      {/* Summary Cards */}
      <div className="row g-4 mb-4 summary-cards">
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{statusCounts.all}</div>
              <h5 className="card-title">Total Participants</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{statusCounts.paid}</div>
              <h5 className="card-title">Paid Registrations</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{statusCounts.pending}</div>
              <h5 className="card-title">Pending Payments</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{availableAgeGroups.length}</div>
              <h5 className="card-title">Age Groups</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4 filters-card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
              >
                {ageGroupOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedPageant}
                onChange={(e) => setSelectedPageant(e.target.value)}
              >
                {pageantOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      {filteredAndSortedParticipants.length === 0 ? (
        <EmptyState 
          icon={faExclamationTriangle}
          title="No Participants Found"
          message="No participants match your current search criteria."
          variant="info"
        />
      ) : (
        <div className="card participants-table">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Participant</th>
                    <th>Age Group</th>
                    <th>Contact Info</th>
                    <th>Emergency Contact</th>
                    <th>Pageant</th>
                    <th>Registration</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedParticipants.map((participant) => {
                    const user = participant.user || {};
                    const profile = participant.profile || {};
                    const emergency = profile.emergencyContact || {};
                    
                    return (
                      <tr key={participant._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="avatar me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--brand-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            >
                              {user.firstName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="fw-bold">
                                {user.firstName} {user.lastName}
                              </div>
                              <small className="text-muted">@{user.username}</small>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div>
                            <div className="fw-bold">{user.ageGroup || 'N/A'}</div>
                            <small className="text-muted">
                              Age: {calculateAge(user.dateOfBirth)}
                            </small>
                          </div>
                        </td>
                        
                        <td>
                          <div>
                            <div className="mb-1">
                              <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                              <small>{user.email}</small>
                            </div>
                            {profile.phone && (
                              <div>
                                <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                                <small>{profile.phone}</small>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td>
                          {emergency.name ? (
                            <div>
                              <div className="fw-bold">{emergency.name}</div>
                              <small className="text-muted">
                                {emergency.relationship}
                              </small>
                              {emergency.phone && (
                                <div>
                                  <FontAwesomeIcon icon={faPhone} className="me-1 text-muted" />
                                  <small>{emergency.phone}</small>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </td>
                        
                        <td>
                          <div>
                            <div className="fw-bold">{participant.pageant?.name || 'N/A'}</div>
                            <small className="text-muted">
                              {participant.categories?.length || 0} categories
                            </small>
                          </div>
                        </td>
                        
                        <td>
                          <div>
                            <div>{formatDate(participant.registrationDate)}</div>
                            <small className="text-muted">
                              {formatDate(participant.pageant?.startDate)}
                            </small>
                          </div>
                        </td>
                        
                        <td>
                          <div>
                            {getStatusBadge(participant.paymentStatus)}
                            <div className="mt-1">
                              <small className="text-muted">
                                {formatCurrency(participant.paymentAmount)}
                              </small>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openDetailsModal(participant)}
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Participant Details Modal */}
      {showDetailsModal && selectedParticipant && (
        <div className="modal fade show participant-details-modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Participant Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={closeDetailsModal}
                ></button>
              </div>
              <div className="modal-body">
                {(() => {
                  const user = selectedParticipant.user || {};
                  const profile = selectedParticipant.profile || {};
                  const emergency = profile.emergencyContact || {};
                  const medical = profile.medicalInformation || {};
                  
                  return (
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Personal Information</h6>
                        <div className="mb-3">
                          <strong>Full Name:</strong><br />
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="mb-3">
                          <strong>Email:</strong><br />
                          {user.email}
                        </div>
                        <div className="mb-3">
                          <strong>Username:</strong><br />
                          {user.username}
                        </div>
                        <div className="mb-3">
                          <strong>Date of Birth:</strong><br />
                          {formatDate(user.dateOfBirth)}
                        </div>
                        <div className="mb-3">
                          <strong>Age Group:</strong><br />
                          {user.ageGroup || 'Not specified'}
                        </div>
                        {profile.phone && (
                          <div className="mb-3">
                            <strong>Phone:</strong><br />
                            {profile.phone}
                          </div>
                        )}
                        
                        <h6 className="fw-bold mb-3 mt-4">Emergency Contact</h6>
                        {emergency.name ? (
                          <>
                            <div className="mb-3">
                              <strong>Name:</strong><br />
                              {emergency.name}
                            </div>
                            <div className="mb-3">
                              <strong>Relationship:</strong><br />
                              {emergency.relationship}
                            </div>
                            <div className="mb-3">
                              <strong>Phone:</strong><br />
                              {emergency.phone}
                            </div>
                          </>
                        ) : (
                          <p className="text-muted">No emergency contact provided</p>
                        )}
                      </div>
                      
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Pageant Registration</h6>
                        <div className="mb-3">
                          <strong>Pageant:</strong><br />
                          {selectedParticipant.pageant?.name || 'N/A'}
                        </div>
                        <div className="mb-3">
                          <strong>Registration Date:</strong><br />
                          {formatDate(selectedParticipant.registrationDate)}
                        </div>
                        <div className="mb-3">
                          <strong>Categories:</strong><br />
                          {selectedParticipant.categories?.length > 0 ? (
                            <ul className="list-unstyled">
                              {selectedParticipant.categories.map((cat, idx) => (
                                <li key={idx}>• {cat.category}</li>
                              ))}
                            </ul>
                          ) : (
                            'No categories'
                          )}
                        </div>
                        <div className="mb-3">
                          <strong>Payment Status:</strong><br />
                          {getStatusBadge(selectedParticipant.paymentStatus)}
                        </div>
                        <div className="mb-3">
                          <strong>Payment Amount:</strong><br />
                          {formatCurrency(selectedParticipant.paymentAmount)}
                        </div>
                        
                        <h6 className="fw-bold mb-3 mt-4">Medical Information</h6>
                        {medical.allergies || medical.medicalConditions ? (
                          <>
                            {medical.allergies && (
                              <div className="mb-3">
                                <strong>Allergies:</strong><br />
                                {medical.allergies}
                              </div>
                            )}
                            {medical.medicalConditions && (
                              <div className="mb-3">
                                <strong>Medical Conditions:</strong><br />
                                {medical.medicalConditions}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted">No medical information provided</p>
                        )}
                        
                        {profile.biography && (
                          <>
                            <h6 className="fw-bold mb-3 mt-4">Biography</h6>
                            <p>{profile.biography}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeDetailsModal}
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

export default OrganizationParticipants;
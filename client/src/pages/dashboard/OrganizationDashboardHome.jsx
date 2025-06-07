// client/src/pages/dashboard/OrganizationDashboardHome.jsx - UPDATED VERSION
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding, 
  faPlus, 
  faTrophy,
  faUsers,
  faExclamationTriangle,
  faDollarSign,
  faClipboardCheck,
  faCalendarAlt,
  faEye,
  faEdit,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faChartBar,
  faFileAlt,
  faMoneyBillWave,
  faBell,
  faArrowRight,
  faUserCheck,
  faCalendarPlus
} from "@fortawesome/free-solid-svg-icons";

// Import reusable components
import { 
  DashboardPageHeader, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  StatCard,
  ActionButton
} from '../../components/dashboard/common';

const OrganizationDashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [organizations, setOrganizations] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    activePageants: [],
    recentRegistrations: [],
    pendingActions: [],
    recentActivity: [],
    stats: {
      totalActivePageants: 0,
      totalParticipants: 0,
      pendingActions: 0,
      monthlyRevenue: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch organizations
      const orgResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/organizations/user`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!orgResponse.ok) throw new Error("Failed to fetch organizations");
      const orgData = await orgResponse.json();
      setOrganizations(orgData.organizations || []);

      if (orgData.organizations && orgData.organizations.length > 0) {
        // If user has organizations, fetch dashboard data
        await fetchOrganizationDashboardData(orgData.organizations[0]._id);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific dashboard data for organization
  const fetchOrganizationDashboardData = async (organizationId) => {
    try {
      // Fetch pageants for the organization
      const pageantResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pageants/organization/${organizationId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      if (pageantResponse.ok) {
        const pageantData = await pageantResponse.json();
        const pageants = pageantData.pageants || [];

        // Process pageants data
        const now = new Date();
        const activePageants = pageants.filter(p => {
          const startDate = new Date(p.startDate);
          const endDate = new Date(p.endDate);
          return (startDate > now || (startDate <= now && endDate >= now)) && p.status !== 'cancelled';
        });

        // Mock data for demonstration (replace with real API calls)
        const mockRecentRegistrations = [
          {
            id: 1,
            contestantName: "Emily Johnson",
            pageantName: "Spring Beauty Pageant 2025",
            registeredAt: new Date().toISOString(),
            status: "pending",
            photo: null
          },
          {
            id: 2,
            contestantName: "Sarah Williams",
            pageantName: "Teen Miss Columbus 2025",
            registeredAt: new Date(Date.now() - 86400000).toISOString(),
            status: "approved",
            photo: null
          }
        ];

        const mockPendingActions = [
          {
            id: 1,
            type: "registration",
            title: "3 new contestant applications",
            description: "Spring Beauty Pageant 2025",
            priority: "high",
            dueDate: new Date(Date.now() + 86400000).toISOString()
          },
          {
            id: 2,
            type: "payment",
            title: "2 overdue payments",
            description: "Registration fees pending",
            priority: "medium",
            dueDate: new Date().toISOString()
          }
        ];

        const mockRecentActivity = [
          {
            id: 1,
            type: "registration",
            message: "Emily Johnson registered for Spring Beauty Pageant 2025",
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: "payment",
            message: "Payment received from Sarah Williams",
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            type: "pageant",
            message: "Teen Miss Columbus 2025 registration deadline in 5 days",
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ];

        // Calculate stats
        const stats = {
          totalActivePageants: activePageants.length,
          totalParticipants: activePageants.reduce((sum, p) => sum + (p.participantCount || 0), 0),
          pendingActions: mockPendingActions.length,
          monthlyRevenue: 2350 // Mock data
        };

        setDashboardData({
          activePageants: activePageants.slice(0, 3),
          recentRegistrations: mockRecentRegistrations,
          pendingActions: mockPendingActions,
          recentActivity: mockRecentActivity.slice(0, 5),
          stats
        });
      }
    } catch (err) {
      console.error("Error fetching organization dashboard data:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Handle input change for organization creation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name.startsWith("address.")) {
        const field = name.split(".")[1];
        return {
          ...prevData,
          address: {
            ...prevData.address,
            [field]: value,
          },
        };
      }

      if (name.startsWith("socialMedia.")) {
        const field = name.split(".")[1];
        return {
          ...prevData,
          socialMedia: {
            ...prevData.socialMedia,
            [field]: value,
          },
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  }, []);

  // Handle organization creation
  const handleSubmit = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (submitting) return;

      if (!formData.name || !formData.description || !formData.contactEmail) {
        setError("Please fill in all required fields");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/organizations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create organization");
        }

        const data = await response.json();
        setOrganizations((prev) => [...prev, data.organization]);

        // Reset form
        setFormData({
          name: "",
          description: "",
          contactEmail: "",
          contactPhone: "",
          address: { street: "", city: "", state: "", zipCode: "", country: "" },
          socialMedia: { facebook: "", instagram: "", twitter: "" },
        });
        setShowCreateForm(false);
        
        // Refresh dashboard data
        fetchDashboardData();
      } catch (err) {
        console.error("Error creating organization:", err);
        setError(err.message || "Failed to create organization. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [formData, submitting, fetchDashboardData]
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Get priority badge class
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning text-dark';
      case 'low': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  // Render organization creation form
  const renderCreateForm = () => (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Create New Organization</h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowCreateForm(false)}
        >
          <FontAwesomeIcon icon="faTimes" />
        </button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="orgName" className="form-label">Organization Name *</label>
            <input
              id="orgName"
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="orgDescription" className="form-label">Description *</label>
            <textarea
              id="orgDescription"
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contactEmail" className="form-label">Contact Email *</label>
            <input
              id="contactEmail"
              type="email"
              className="form-control"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => setShowCreateForm(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <ActionButton
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              Create Organization
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  // If no organizations, show creation interface
  if (organizations.length === 0) {
    return (
      <div className="organization-dashboard-home">
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faBuilding}
            size="4x"
            className="text-secondary mb-3"
          />
          <h2>Welcome to Organization Dashboard</h2>
          <p>You don't have any organizations yet. Create one to get started!</p>
          {!showCreateForm ? (
            <ActionButton
              variant="primary"
              size="large"
              icon={faPlus}
              onClick={() => setShowCreateForm(true)}
            >
              Create Organization
            </ActionButton>
          ) : (
            renderCreateForm()
          )}
        </div>
      </div>
    );
  }

  const primaryOrg = organizations[0];

  return (
    <div className="organization-dashboard-home">
      {/* Welcome Header */}
      <DashboardPageHeader 
        title={`Welcome back, ${primaryOrg.name}!`}
        subtitle={`You have ${dashboardData.stats.totalActivePageants} active pageants and ${dashboardData.stats.pendingActions} items requiring attention`}
      />

      {error && <ErrorAlert message={error} />}

      {/* Key Performance Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <StatCard 
            icon={faTrophy}
            value={dashboardData.stats.totalActivePageants}
            label="Active Pageants"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard 
            icon={faUsers}
            value={dashboardData.stats.totalParticipants}
            label="Total Participants"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard 
            icon={faExclamationTriangle}
            value={dashboardData.stats.pendingActions}
            label="Pending Actions"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard 
            icon={faDollarSign}
            value={formatCurrency(dashboardData.stats.monthlyRevenue)}
            label="This Month's Revenue"
          />
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card mb-5 shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0">Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <Link 
                to={`/organization-dashboard/organizations/${primaryOrg._id}/pageants/new`}
                className="btn btn-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
              >
                <FontAwesomeIcon icon={faCalendarPlus} size="2x" className="mb-2" />
                <span>Create New Pageant</span>
              </Link>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                <FontAwesomeIcon icon={faUserCheck} size="2x" className="mb-2" />
                <span>Review Applications</span>
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                <FontAwesomeIcon icon={faChartBar} size="2x" className="mb-2" />
                <span>Generate Reports</span>
              </button>
            </div>
            <div className="col-md-3">
              <Link 
                to={`/organization-dashboard/organizations/${primaryOrg._id}/pageants`}
                className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
              >
                <FontAwesomeIcon icon={faEye} size="2x" className="mb-2" />
                <span>Manage Pageants</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Active Pageants */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Active Pageants</h5>
              <Link 
                to={`/organization-dashboard/organizations/${primaryOrg._id}/pageants`}
                className="btn btn-sm btn-outline-primary"
              >
                View All
              </Link>
            </div>
            <div className="card-body">
              {dashboardData.activePageants.length === 0 ? (
                <EmptyState 
                  icon={faTrophy}
                  message="No active pageants. Create your first pageant to get started!"
                  actionButton={
                    <Link 
                      to={`/organization-dashboard/organizations/${primaryOrg._id}/pageants/new`}
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Create Pageant
                    </Link>
                  }
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Pageant Name</th>
                        <th>Status</th>
                        <th>Participants</th>
                        <th>Start Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.activePageants.map((pageant) => (
                        <tr key={pageant._id}>
                          <td>
                            <div className="fw-bold">{pageant.name}</div>
                            <small className="text-muted">ID: {pageant.pageantID}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              pageant.status === 'published' ? 'bg-success' : 
                              pageant.status === 'draft' ? 'bg-secondary' : 'bg-warning'
                            }`}>
                              {pageant.status}
                            </span>
                          </td>
                          <td>{pageant.participantCount || 0}</td>
                          <td>{formatDate(pageant.startDate)}</td>
                          <td>
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary">
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
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

          {/* Recent Activity */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              {dashboardData.recentActivity.length === 0 ? (
                <EmptyState 
                  message="No recent activity."
                  variant="info"
                />
              ) : (
                <div className="activity-feed">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item d-flex align-items-start mb-3">
                      <div className="activity-icon me-3">
                        <FontAwesomeIcon 
                          icon={
                            activity.type === 'registration' ? faUserCheck :
                            activity.type === 'payment' ? faMoneyBillWave :
                            activity.type === 'pageant' ? faTrophy :
                            faBell
                          } 
                          className="text-primary"
                        />
                      </div>
                      <div className="activity-content flex-grow-1">
                        <div className="activity-message">{activity.message}</div>
                        <small className="text-muted">{formatTimeAgo(activity.timestamp)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Pending Actions */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Action Items</h5>
            </div>
            <div className="card-body">
              {dashboardData.pendingActions.length === 0 ? (
                <EmptyState 
                  icon={faCheckCircle}
                  message="No pending actions!"
                  variant="success"
                />
              ) : (
                <div className="pending-actions">
                  {dashboardData.pendingActions.map((action) => (
                    <div key={action.id} className="action-item border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge ${getPriorityBadge(action.priority)}`}>
                          {action.priority} priority
                        </span>
                        <small className="text-muted">
                          Due {formatTimeAgo(action.dueDate)}
                        </small>
                      </div>
                      <div className="action-title fw-bold mb-1">{action.title}</div>
                      <div className="action-description text-muted mb-2">{action.description}</div>
                      <button className="btn btn-sm btn-primary w-100">
                        Take Action <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Registrations</h5>
            </div>
            <div className="card-body">
              {dashboardData.recentRegistrations.length === 0 ? (
                <EmptyState 
                  message="No recent registrations."
                  variant="info"
                />
              ) : (
                <div className="recent-registrations">
                  {dashboardData.recentRegistrations.map((registration) => (
                    <div key={registration.id} className="registration-item d-flex align-items-center p-2 mb-2 border rounded">
                      <div className="registration-avatar me-3">
                        <div 
                          className="avatar-circle"
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
                          {registration.contestantName.charAt(0)}
                        </div>
                      </div>
                      <div className="registration-info flex-grow-1">
                        <div className="contestant-name fw-bold">{registration.contestantName}</div>
                        <small className="text-muted">{registration.pageantName}</small>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <small className="text-muted">{formatTimeAgo(registration.registeredAt)}</small>
                          <span className={`badge ${
                            registration.status === 'approved' ? 'bg-success' :
                            registration.status === 'pending' ? 'bg-warning text-dark' :
                            'bg-danger'
                          }`}>
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboardHome;
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faPlus,
  faCalendarAlt,
  faUsers,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faEdit,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import OrgPageantDetailsModal from "../../components/dashboard/OrgPageantDetailsModal";
import EditPageantModal from "../../components/dashboard/EditPageantModal";

const PageantManagement = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState(null);

  const [selectedPageant, setSelectedPageant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pageantToEdit, setPageantToEdit] = useState(null);

  // Filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Fetch organization details and pageants
  useEffect(() => {
    const fetchOrganizationAndPageants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch organization details
        const orgResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/organizations/${organizationId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!orgResponse.ok) {
          throw new Error("Failed to fetch organization details");
        }

        const orgData = await orgResponse.json();
        setOrganization(orgData.organization);

        // Fetch pageants for this organization
        const pageantResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/pageants/organization/${organizationId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!pageantResponse.ok) {
          throw new Error("Failed to fetch pageants");
        }

        const pageantData = await pageantResponse.json();
        setPageants(pageantData.pageants || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationAndPageants();
    }
  }, [organizationId]);

  // Add these functions for managing the modal
  const openPageantDetails = (pageant) => {
    setSelectedPageant(pageant);
    setIsModalOpen(true);
  };

  const closePageantDetails = () => {
    setIsModalOpen(false);
    setSelectedPageant(null);
  };

  const navigateToEditPageant = (pageantId) => {
    navigate(`/organization-dashboard/pageants/${pageantId}/edit`);
  };

  // Function to open the edit modal
  const handleEditPageant = (pageant) => {
    setPageantToEdit(pageant);
    setEditModalOpen(true);
  };

  // Function to handle saving the edited pageant
  const handleSavePageant = async (formData) => {
    try {
      // Make API request to update the pageant
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pageants/${pageantToEdit._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update pageant');
      }

      const data = await response.json();
      
      // Update the pageants list with the updated pageant
      setPageants(prevPageants => 
        prevPageants.map(p => p._id === pageantToEdit._id ? data.pageant : p)
      );
      
      // Close the modal
      setEditModalOpen(false);
      setPageantToEdit(null);
      
      // Show success message or notification
      // ...
    } catch (error) {
      console.error('Error updating pageant:', error);
      // Handle error (you might want to propagate this to the modal component)
      throw error;
    }
  };

  // Filter and sort pageants
  const getFilteredPageants = () => {
    let filtered = [...pageants];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((pageant) =>
        pageant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((pageant) => pageant.status === statusFilter);
    }

    // Apply sorting
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "startDate") {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortOrder === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  // Get stats for dashboard cards
  const getStats = () => {
    const stats = {
      total: pageants.length,
      active: pageants.filter((p) => p.status === "published").length,
      upcoming: pageants.filter((p) => {
        const startDate = new Date(p.startDate);
        const now = new Date();
        return startDate > now && p.status === "published";
      }).length,
      past: pageants.filter((p) => {
        const endDate = new Date(p.endDate);
        const now = new Date();
        return endDate < now;
      }).length,
    };

    return stats;
  };

  // Format a date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    let className = "";
    let label = "";

    switch (status) {
      case "draft":
        className = "bg-secondary";
        label = "Draft";
        break;
      case "published":
        className = "bg-success";
        label = "Published";
        break;
      case "registration-closed":
        className = "bg-warning text-dark";
        label = "Registration Closed";
        break;
      case "in-progress":
        className = "bg-primary";
        label = "In Progress";
        break;
      case "completed":
        className = "bg-info text-dark";
        label = "Completed";
        break;
      case "cancelled":
        className = "bg-danger";
        label = "Cancelled";
        break;
      default:
        className = "bg-secondary";
        label = "Unknown";
    }

    return <span className={`badge ${className}`}>{label}</span>;
  };

  // Handle pageant deletion
  const handleDeletePageant = async (pageantId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this pageant? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/pageants/${pageantId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pageant");
      }

      // Update state to remove the deleted pageant
      setPageants(pageants.filter((p) => p._id !== pageantId));
    } catch (error) {
      console.error("Error deleting pageant:", error);
      alert(`Failed to delete pageant: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
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

  const stats = getStats();
  const filteredPageants = getFilteredPageants();

  return (
    <div className="pageant-management-container">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">Pageant Management</h2>
            <p className="text-muted">
              {organization
                ? `Organization: ${organization.name}`
                : "Loading..."}
            </p>
          </div>
          <Link
            to={`/organization-dashboard/organizations/${organizationId}/pageants/new`}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Create New Pageant
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{stats.total}</div>
              <h5 className="card-title">Total Pageants</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{stats.active}</div>
              <h5 className="card-title">Active Pageants</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{stats.upcoming}</div>
              <h5 className="card-title">Upcoming Pageants</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <div className="display-4 mb-2">{stats.past}</div>
              <h5 className="card-title">Past Pageants</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search pageants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="registration-closed">
                    Registration Closed
                  </option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSort} />
                </span>
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="startDate">By Start Date</option>
                  <option value="name">By Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pageants List */}
      {pageants.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faTrophy}
            size="4x"
            className="text-secondary mb-3"
          />
          <h3>No Pageants Found</h3>
          <p className="text-muted">
            You haven't created any pageants for this organization yet.
          </p>
          <Link
            to={`/organization-dashboard/organizations/${organizationId}/pageants/new`}
            className="btn btn-primary mt-3"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Create Your First Pageant
          </Link>
        </div>
      ) : filteredPageants.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          No pageants match your search criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Pageant Name</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPageants.map((pageant) => (
                <tr key={pageant._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faTrophy}
                        className="me-3 text-secondary"
                      />
                      <div>
                        <div className="fw-bold">{pageant.name}</div>
                        <small className="text-muted">ID: {pageant.pageantID}</small>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(pageant.status)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="me-2 text-muted"
                      />
                      <div>
                        <div>Start: {formatDate(pageant.startDate)}</div>
                        <div>End: {formatDate(pageant.endDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="me-2 text-muted"
                      />
                      <div>{pageant.participantCount || 0} registered</div>
                    </div>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openPageantDetails(pageant)}
                        title="View Pageant Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEditPageant(pageant)}
                        title="Edit Pageant"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePageant(pageant._id)}
                        title="Delete Pageant"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <OrgPageantDetailsModal 
          pageant={selectedPageant}
          isOpen={isModalOpen}
          onClose={closePageantDetails}
          onEdit={navigateToEditPageant}
          orgName={organization.name}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && pageantToEdit && (
        <EditPageantModal 
          pageant={pageantToEdit}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setPageantToEdit(null);
          }}
          onSave={handleSavePageant}
        />
      )}
    </div>
  );
};

export default PageantManagement;

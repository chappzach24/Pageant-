import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faPlus, faTimes, faTrophy } from "@fortawesome/free-solid-svg-icons";

const OrganizationDashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
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

  // Fetch user's organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/organizations/user`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch organizations");

        const data = await response.json();
        setOrganizations(data.organizations || []);
      } catch (err) {
        console.error("Error fetching organizations:", err);
        setError("Failed to load your organizations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrganizations();
    }
  }, [user]);

  // Memoized input change handler to prevent unnecessary re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      // Handle nested object updates for address
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

      // Handle nested object updates for social media
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

      // Handle top-level field updates
      return {
        ...prevData,
        [name]: value,
      };
    });
  }, []);

  // Prevent form submission and page reload
  const handleSubmit = useCallback(
    async (e) => {
      // Absolutely prevent default form submission
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Prevent multiple submissions
      if (submitting) return;

      // Validate form data
      if (!formData.name || !formData.description || !formData.contactEmail) {
        setError("Please fill in all required fields");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/organizations`,
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
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          socialMedia: { facebook: "", instagram: "", twitter: "" },
        });
        setShowCreateForm(false);
      } catch (err) {
        console.error("Error creating organization:", err);
        setError(
          err.message || "Failed to create organization. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [formData, submitting]
  );

  // Render form with extensive event handling
  const renderForm = () => (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Create New Organization</h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowCreateForm(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form
          onSubmit={handleSubmit}
          // Prevent default form behavior
          onKeyDown={(e) => {
            // Prevent form submission on Enter key
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          // Additional protection against unintended submissions
          noValidate
        >
          <div className="mb-3">
            <label htmlFor="orgName" className="form-label">
              Organization Name *
            </label>
            <input
              id="orgName"
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              // Prevent automatic form submission
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="orgDescription" className="form-label">
              Description *
            </label>
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
            <label htmlFor="contactEmail" className="form-label">
              Contact Email *
            </label>
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

          <div className="mb-3">
            <label htmlFor="contactPhone" className="form-label">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              type="tel"
              className="form-control"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </div>

          <h5 className="mt-4">Address Information</h5>
          <div className="row g-3 mb-3">
            <div className="col-12">
              <label htmlFor="addressStreet" className="form-label">
                Street
              </label>
              <input
                id="addressStreet"
                type="text"
                className="form-control"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="addressCity" className="form-label">
                City
              </label>
              <input
                id="addressCity"
                type="text"
                className="form-control"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="addressState" className="form-label">
                State
              </label>
              <input
                id="addressState"
                type="text"
                className="form-control"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="addressZip" className="form-label">
                Zip Code
              </label>
              <input
                id="addressZip"
                type="text"
                className="form-control"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="addressCountry" className="form-label">
                Country
              </label>
              <input
                id="addressCountry"
                type="text"
                className="form-control"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <h5 className="mt-4">Social Media</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="socialFacebook" className="form-label">
                Facebook
              </label>
              <input
                id="socialFacebook"
                type="text"
                className="form-control"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleInputChange}
                placeholder="Facebook page URL"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="socialInstagram" className="form-label">
                Instagram
              </label>
              <input
                id="socialInstagram"
                type="text"
                className="form-control"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleInputChange}
                placeholder="Instagram handle or URL"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="socialTwitter" className="form-label">
                Twitter
              </label>
              <input
                id="socialTwitter"
                type="text"
                className="form-control"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleInputChange}
                placeholder="Twitter handle or URL"
              />
            </div>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Conditional rendering based on organizations
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-dashboard-home">
      {organizations.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faBuilding}
            size="4x"
            className="text-secondary mb-3"
          />
          <h2>Welcome to Organization Dashboard</h2>
          <p>
            You don't have any organizations yet. Create one to get started!
          </p>
          {!showCreateForm ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowCreateForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Create
              Organization
            </button>
          ) : (
            renderForm()
          )}
        </div>
      ) : (
        <div className="py-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Your Organizations</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Create New
              Organization
            </button>
          </div>

          {showCreateForm && renderForm()}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4">
            {organizations.map((org) => (
              <div className="col-md-6 col-lg-4" key={org._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5>{org.name}</h5>
                    <p className="text-truncate">{org.description}</p>
                    <small className="text-muted">
                      Created: {new Date(org.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="card-footer d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary flex-fill"
                      onClick={() => navigate(`/organization-dashboard/organizations/${org._id}/pageants`)}
                    >
                      <FontAwesomeIcon icon={faTrophy} className="me-2" />
                      Manage Pageants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboardHome;
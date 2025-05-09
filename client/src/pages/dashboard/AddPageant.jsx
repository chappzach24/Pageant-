import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faCalendarAlt,
  faMoneyBillWave,
  faTrophy,
  faPlus,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const AddPageant = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    organization: organizationId,
    startDate: "",
    endDate: "",
    competitionYear: new Date().getFullYear(),
    location: {
      venue: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      virtual: false,
    },
    registrationDeadline: "",
    maxParticipants: 0,
    entryFee: {
      amount: 0,
      currency: "USD",
    },
    ageGroups: [],
    categories: [],
    prizes: [],
    status: "draft",
    isPublic: true,
  });

  // Available age groups
  const availableAgeGroups = [
    "5 - 8 Years",
    "9 - 12 Years",
    "13 - 18 Years",
    "19 - 39 Years",
    "40+ Years",
  ];

  // Handle age group selection
  const handleAgeGroupChange = (ageGroup) => {
    const updatedAgeGroups = [...formData.ageGroups];

    if (updatedAgeGroups.includes(ageGroup)) {
      // Remove age group if already selected
      const index = updatedAgeGroups.indexOf(ageGroup);
      updatedAgeGroups.splice(index, 1);
    } else {
      // Add age group if not selected
      updatedAgeGroups.push(ageGroup);
    }

    setFormData({
      ...formData,
      ageGroups: updatedAgeGroups,
    });
  };

  // Add empty category
  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        {
          name: "",
          description: "",
          price: 0,  // Still stores 0, but UI will show empty
          scoringCriteria: [],
        },
      ],
    });
  };

  // Remove category
  const removeCategory = (index) => {
    const updatedCategories = [...formData.categories];
    updatedCategories.splice(index, 1);

    setFormData({
      ...formData,
      categories: updatedCategories,
    });
  };

  // Handle category change
  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index][field] = value;

    setFormData({
      ...formData,
      categories: updatedCategories,
    });
  };

  // Add empty prize
  const addPrize = () => {
    setFormData({
      ...formData,
      prizes: [
        ...formData.prizes,
        {
          title: "",
          description: "",
          value: 0,
          forAgeGroup: "All",
        },
      ],
    });
  };

  // Remove prize
  const removePrize = (index) => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes.splice(index, 1);

    setFormData({
      ...formData,
      prizes: updatedPrizes,
    });
  };

  // Handle prize change
  const handlePrizeChange = (index, field, value) => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes[index][field] = value;

    setFormData({
      ...formData,
      prizes: updatedPrizes,
    });
  };

  // Handle input change for top-level fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle special cases
    if (name === "maxParticipants" || name === "competitionYear") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else if (name === "entryFee.amount") {
      setFormData({
        ...formData,
        entryFee: {
          ...formData.entryFee,
          amount: parseFloat(value) || 0,
        },
      });
    } else if (name === "entryFee.currency") {
      setFormData({
        ...formData,
        entryFee: {
          ...formData.entryFee,
          currency: value,
        },
      });
    } else if (name === "location.venue") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          venue: value,
        },
      });
    } else if (name === "location.virtual") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          virtual: checked,
        },
      });
    } else if (name.startsWith("location.address.")) {
      const addressField = name.split(".")[2];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: {
            ...formData.location.address,
            [addressField]: value,
          },
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fetch organization details
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
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

        if (!response.ok) {
          throw new Error("Failed to fetch organization details");
        }

        const data = await response.json();
        setOrganization(data.organization);
      } catch (error) {
        console.error("Error fetching organization:", error);
        setError(
          "Failed to load organization details. Please try again later."
        );
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.description ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.registrationDeadline
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.ageGroups.length === 0) {
        throw new Error("Please select at least one age group");
      }

      if (formData.categories.length === 0) {
        throw new Error("Please add at least one category");
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const registrationDeadline = new Date(formData.registrationDeadline);
      const today = new Date();

      if (startDate <= today) {
        throw new Error("Start date must be in the future");
      }

      if (endDate <= startDate) {
        throw new Error("End date must be after start date");
      }

      if (registrationDeadline >= startDate) {
        throw new Error("Registration deadline must be before start date");
      }

      // Send request to create pageant
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/pageants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create pageant");
      }

      const data = await response.json();
      setSuccessMessage("Pageant created successfully!");

      // Redirect to pageant details page after short delay
      setTimeout(() => {
        navigate(`/organization-dashboard/pageants/${data.pageant._id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating pageant:", error);
      setError(error.message || "Failed to create pageant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pageant-container">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">Create New Pageant</h2>
            <p className="text-muted">
              {organization
                ? `For organization: ${organization.name}`
                : "Loading organization details..."}
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Basic Information */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Pageant Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="competitionYear" className="form-label">
                      Competition Year *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="competitionYear"
                      name="competitionYear"
                      value={formData.competitionYear}
                      onChange={handleInputChange}
                      min={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      Description *
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates and Registration */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Dates
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="registrationDeadline"
                      className="form-label"
                    >
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="registrationDeadline"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleInputChange}
                      required
                    />
                    <small className="text-muted">
                      Must be before the start date
                    </small>
                  </div>

                  <div className="col-12">
                    <label htmlFor="maxParticipants" className="form-label">
                      Maximum Participants
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                    />
                    <small className="text-muted">
                      Set to 0 for unlimited participants
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Location</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="location.venue" className="form-label">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.venue"
                      name="location.venue"
                      value={formData.location.venue}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <div
                      className="mb-3 form-check"
                      style={{ marginTop: "2rem" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="location.virtual"
                        name="location.virtual"
                        checked={formData.location.virtual}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="location.virtual"
                      >
                        Virtual Event
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="location.address.street"
                      className="form-label"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.address.street"
                      name="location.address.street"
                      value={formData.location.address.street}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="location.address.city"
                      className="form-label"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.address.city"
                      name="location.address.city"
                      value={formData.location.address.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="location.address.state"
                      className="form-label"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.address.state"
                      name="location.address.state"
                      value={formData.location.address.state}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="location.address.zipCode"
                      className="form-label"
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.address.zipCode"
                      name="location.address.zipCode"
                      value={formData.location.address.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="location.address.country"
                      className="form-label"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location.address.country"
                      name="location.address.country"
                      value={formData.location.address.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Fee */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                  Entry Fee
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="entryFee.amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="entryFee.amount"
                      name="entryFee.amount"
                      value={formData.entryFee.amount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="entryFee.currency" className="form-label">
                      Currency
                    </label>
                    <select
                      className="form-select"
                      id="entryFee.currency"
                      name="entryFee.currency"
                      value={formData.entryFee.currency}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Age Groups */}
          <div className="col-md-8">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Age Groups *</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  Select all age groups that can participate in this pageant
                </p>
                <div className="row g-3">
                  {availableAgeGroups.map((ageGroup, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`ageGroup-${index}`}
                          checked={formData.ageGroups.includes(ageGroup)}
                          onChange={() => handleAgeGroupChange(ageGroup)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`ageGroup-${index}`}
                        >
                          {ageGroup}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.ageGroups.length === 0 && (
                  <div className="alert alert-warning mt-3" role="alert">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Please select at least one age group
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Categories *</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={addCategory}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Category
                </button>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  Define the categories for this pageant (e.g., Evening Gown,
                  Talent, Interview)
                </p>

                {formData.categories.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    No categories added yet. Click "Add Category" to get
                    started.
                  </div>
                ) : (
                  <div className="row g-4">
                    {formData.categories.map((category, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="card">
                          <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Category {index + 1}</h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeCategory(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label
                                htmlFor={`category-name-${index}`}
                                className="form-label"
                              >
                                Name *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id={`category-name-${index}`}
                                value={category.name}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor={`category-description-${index}`}
                                className="form-label"
                              >
                                Description
                              </label>
                              <textarea
                                className="form-control"
                                id={`category-description-${index}`}
                                rows="2"
                                value={category.description}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                              ></textarea>
                            </div>
                            
                            {/* FIXED: Category Price Field - shows empty instead of 0 */}
                            <div className="mb-3">
                              <label
                                htmlFor={`category-price-${index}`}
                                className="form-label"
                              >
                                Price ($)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id={`category-price-${index}`}
                                value={category.price === 0 ? '' : category.price}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    index,
                                    "price",
                                    e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                  )
                                }
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                              />
                            </div>
                            {/* END FIXED */}
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prizes */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faTrophy} className="me-2" />
                  Prizes
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={addPrize}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Prize
                </button>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  Define the prizes for this pageant (optional)
                </p>

                {formData.prizes.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    No prizes added yet. Click "Add Prize" to define prizes.
                  </div>
                ) : (
                  <div className="row g-4">
                    {formData.prizes.map((prize, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="card">
                          <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Prize {index + 1}</h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removePrize(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label
                                htmlFor={`prize-title-${index}`}
                                className="form-label"
                              >
                                Title *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id={`prize-title-${index}`}
                                value={prize.title}
                                onChange={(e) =>
                                  handlePrizeChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Grand Champion, Runner-up"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor={`prize-description-${index}`}
                                className="form-label"
                              >
                                Description
                              </label>
                              <textarea
                                className="form-control"
                                id={`prize-description-${index}`}
                                rows="2"
                                value={prize.description}
                                onChange={(e) =>
                                  handlePrizeChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe the prize details"
                              ></textarea>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <label
                                  htmlFor={`prize-value-${index}`}
                                  className="form-label"
                                >
                                  Value
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id={`prize-value-${index}`}
                                  value={prize.value}
                                  onChange={(e) =>
                                    handlePrizeChange(
                                      index,
                                      "value",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div className="col-md-6">
                                <label
                                  htmlFor={`prize-ageGroup-${index}`}
                                  className="form-label"
                                >
                                  For Age Group
                                </label>
                                <select
                                  className="form-select"
                                  id={`prize-ageGroup-${index}`}
                                  value={prize.forAgeGroup}
                                  onChange={(e) =>
                                    handlePrizeChange(
                                      index,
                                      "forAgeGroup",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="All">All Age Groups</option>
                                  {formData.ageGroups.map((ageGroup, idx) => (
                                    <option key={idx} value={ageGroup}>
                                      {ageGroup}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy and Publishing */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Privacy and Publishing</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">
                      Pageant Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="draft">
                        Draft - Not visible to contestants
                      </option>
                      <option value="published">
                        Published - Open for registration
                      </option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="d-block mb-2">Visibility</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        Make this pageant publicly visible in pageant listings
                      </label>
                    </div>
                    <small className="text-muted">
                      If turned off, only you will be able to see this pageant
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submission */}
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating Pageant...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Create Pageant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPageant;
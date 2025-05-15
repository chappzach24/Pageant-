// client/src/components/dashboard/EditPageantModal.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faLocationDot,
  faUsers,
  faMoneyBillWave,
  faTrophy,
  faClipboardList,
  faBuilding,
  faGlobe,
  faIdCard,
  faSave,
  faTimes,
  faPlus,
  faTrash,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const EditPageantModal = ({ pageant, isOpen, onClose, onSave }) => {
    console.log(pageant);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Available age groups
  const availableAgeGroups = [
    "5 - 8 Years",
    "9 - 12 Years",
    "13 - 18 Years",
    "19 - 39 Years",
    "40+ Years",
  ];

  // Initialize form data when pageant prop changes
  useEffect(() => {
    if (pageant) {
      setFormData({
        name: pageant.name || '',
        description: pageant.description || '',
        startDate: formatDateForInput(pageant.startDate) || '',
        endDate: formatDateForInput(pageant.endDate) || '',
        competitionYear: pageant.competitionYear || new Date().getFullYear(),
        location: {
          venue: pageant.location?.venue || '',
          virtual: pageant.location?.virtual || false,
          address: {
            street: pageant.location?.address?.street || '',
            city: pageant.location?.address?.city || '',
            state: pageant.location?.address?.state || '',
            zipCode: pageant.location?.address?.zipCode || '',
            country: pageant.location?.address?.country || '',
          }
        },
        registrationDeadline: formatDateForInput(pageant.registrationDeadline) || '',
        maxParticipants: pageant.maxParticipants || 0,
        entryFee: {
          amount: pageant.entryFee?.amount || 0,
          currency: pageant.entryFee?.currency || 'USD',
        },
        ageGroups: pageant.ageGroups || [],
        categories: pageant.categories?.map(cat => {
          if (typeof cat === 'string') {
            return { name: cat, description: '', price: 0 };
          }
          return { 
            name: cat.name || cat.category || '',
            description: cat.description || '',
            price: cat.price || 0
          };
        }) || [],
        prizes: pageant.prizes || [],
        status: pageant.status || 'draft',
        isPublic: pageant.isPublic !== undefined ? pageant.isPublic : true,
      });
    }
  }, [pageant]);

  // Format date for form input fields (YYYY-MM-DD format)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle input change for form fields
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
          price: 0,
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      if (formData.categories.length === 0 || formData.categories.some(cat => !cat.name)) {
        throw new Error("Please add at least one category with a name");
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const registrationDeadline = new Date(formData.registrationDeadline);

      if (endDate <= startDate) {
        throw new Error("End date must be after start date");
      }

      if (registrationDeadline >= startDate) {
        throw new Error("Registration deadline must be before start date");
      }

      // Call the onSave callback with form data
      await onSave(formData);
      
      // Close the modal on success
      onClose();
    } catch (error) {
      console.error("Error saving pageant:", error);
      setError(error.message || "Failed to save pageant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Return null if modal shouldn't be shown
  if (!isOpen || !pageant) return null;

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
          flexDirection: 'column'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h5 className="modal-title">Edit Pageant: {pageant.name}</h5>
                <small className="text-muted">ID: {pageant.pageantID}</small>
              </div>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            {/* Modal Navigation Tabs */}
            <ul className="nav nav-tabs nav-justified">
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Basic Info
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${activeTab === 'location' ? 'active' : ''}`}
                  onClick={() => setActiveTab('location')}
                >
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  Location
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categories')}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  Categories
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${activeTab === 'prizes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('prizes')}
                >
                  <FontAwesomeIcon icon={faTrophy} className="me-2" />
                  Prizes
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  Settings
                </button>
              </li>
            </ul>
            
            {/* Modal Body with Tab Content */}
            <div className="modal-body" style={{ overflowY: 'auto' }}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="tab-content">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Pageant Name *</label>
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
                      
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description *</label>
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
                      
                      <div className="mb-3">
                        <label htmlFor="competitionYear" className="form-label">Competition Year *</label>
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
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">Start Date *</label>
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
                      
                      <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">End Date *</label>
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
                      
                      <div className="mb-3">
                        <label htmlFor="registrationDeadline" className="form-label">Registration Deadline *</label>
                        <input
                          type="date"
                          className="form-control"
                          id="registrationDeadline"
                          name="registrationDeadline"
                          value={formData.registrationDeadline}
                          onChange={handleInputChange}
                          required
                        />
                        <small className="text-muted">Must be before the start date</small>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="maxParticipants" className="form-label">Maximum Participants</label>
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
                        <small className="text-muted">Set to 0 for unlimited participants</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="entryFee.amount" className="form-label">Entry Fee Amount</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            id="entryFee.amount"
                            name="entryFee.amount"
                            value={formData.entryFee?.amount}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                          />
                          <select
                            className="form-select"
                            style={{ maxWidth: '120px' }}
                            id="entryFee.currency"
                            name="entryFee.currency"
                            value={formData.entryFee?.currency}
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
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <label className="form-label">Age Groups *</label>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            {availableAgeGroups.map((ageGroup, index) => (
                              <div className="col-md-4" key={index}>
                                <div className="form-check mb-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`ageGroup-${index}`}
                                    checked={formData.ageGroups?.includes(ageGroup)}
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
                          {formData.ageGroups?.length === 0 && (
                            <div className="alert alert-warning mt-3 mb-0" role="alert">
                              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                              Please select at least one age group
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Location Tab */}
              {activeTab === 'location' && (
                <div className="tab-content">
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="location.venue" className="form-label">Venue Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location.venue"
                          name="location.venue"
                          value={formData.location.venue}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="location.virtual"
                          name="location.virtual"
                          checked={formData.location.virtual}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="location.virtual">
                          This is a virtual event
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <h5 className="mb-3">Physical Address</h5>
                      <div className="card">
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label htmlFor="location.address.street" className="form-label">Street Address</label>
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
                              <label htmlFor="location.address.city" className="form-label">City</label>
                              <input
                                type="text"
                                className="form-control"
                                id="location.address.city"
                                name="location.address.city"
                                value={formData.location.address.city}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="col-md-4">
                              <label htmlFor="location.address.state" className="form-label">State</label>
                              <input
                                type="text"
                                className="form-control"
                                id="location.address.state"
                                name="location.address.state"
                                value={formData.location.address.state}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="col-md-2">
                              <label htmlFor="location.address.zipCode" className="form-label">Zip Code</label>
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
                              <label htmlFor="location.address.country" className="form-label">Country</label>
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
                  </div>
                </div>
              )}
              
              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Pageant Categories</h5>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={addCategory}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add Category
                    </button>
                  </div>
                  
                  {formData.categories.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                      No categories have been defined for this pageant. Click the "Add Category" button to create a category.
                    </div>
                  ) : (
                    <div className="row">
                      {formData.categories.map((category, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                          <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
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
                                <label htmlFor={`category-name-${index}`} className="form-label">Name *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`category-name-${index}`}
                                  value={category.name}
                                  onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div className="mb-3">
                                <label htmlFor={`category-description-${index}`} className="form-label">Description</label>
                                <textarea
                                  className="form-control"
                                  id={`category-description-${index}`}
                                  rows="3"
                                  value={category.description}
                                  onChange={(e) => handleCategoryChange(index, "description", e.target.value)}
                                ></textarea>
                              </div>
                              
                              <div className="mb-3">
                                <label htmlFor={`category-price-${index}`} className="form-label">Additional Fee ($)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id={`category-price-${index}`}
                                  value={category.price === 0 ? '' : category.price}
                                  onChange={(e) => handleCategoryChange(
                                    index,
                                    "price",
                                    e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                  )}
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Prizes Tab */}
              {activeTab === 'prizes' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Pageant Prizes</h5>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={addPrize}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add Prize
                    </button>
                  </div>
                  
                  {formData.prizes.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                      No prizes have been defined for this pageant. Click the "Add Prize" button to create a prize.
                    </div>
                  ) : (
                    <div className="row">
                      {formData.prizes.map((prize, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                          <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
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
                                <label htmlFor={`prize-title-${index}`} className="form-label">Title *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`prize-title-${index}`}
                                  value={prize.title}
                                  onChange={(e) => handlePrizeChange(index, "title", e.target.value)}
                                  placeholder="e.g., Grand Champion, Runner-up"
                                  required
                                />
                              </div>
                              
                              <div className="mb-3">
                                <label htmlFor={`prize-description-${index}`} className="form-label">Description</label>
                                <textarea
                                  className="form-control"
                                  id={`prize-description-${index}`}
                                  rows="3"
                                  value={prize.description}
                                  onChange={(e) => handlePrizeChange(index, "description", e.target.value)}
                                  placeholder="Describe the prize details"
                                ></textarea>
                              </div>
                              
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label htmlFor={`prize-value-${index}`} className="form-label">Value ($)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id={`prize-value-${index}`}
                                    value={prize.value === 0 ? '' : prize.value}
                                    onChange={(e) => handlePrizeChange(
                                      index,
                                      "value",
                                      e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                    )}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                  />
                                </div>
                                
                                <div className="col-md-6">
                                  <label htmlFor={`prize-ageGroup-${index}`} className="form-label">For Age Group</label>
                                  <select
                                    className="form-select"
                                    id={`prize-ageGroup-${index}`}
                                    value={prize.forAgeGroup}
                                    onChange={(e) => handlePrizeChange(index, "forAgeGroup", e.target.value)}
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
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="tab-content">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header">
                          <h6 className="mb-0">Pageant Status</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                              className="form-select"
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                            >
                              <option value="draft">Draft - Not visible to contestants</option>
                              <option value="published">Published - Open for registration</option>
                              <option value="registration-closed">Registration Closed - No new registrations</option>
                              <option value="in-progress">In Progress - Pageant is ongoing</option>
                              <option value="completed">Completed - Pageant has ended</option>
                              <option value="cancelled">Cancelled - Pageant is cancelled</option>
                            </select>
                          </div>
                          
                          <div className="alert alert-info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            <small>
                              <strong>Draft:</strong> Only you can see this pageant.<br />
                              <strong>Published:</strong> Contestants can register for this pageant.<br />
                              <strong>Registration Closed:</strong> No new registrations, but pageant is still upcoming.<br />
                              <strong>In Progress:</strong> The pageant is currently taking place.<br />
                              <strong>Completed:</strong> The pageant has concluded.<br />
                              <strong>Cancelled:</strong> The pageant has been cancelled.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header">
                          <h6 className="mb-0">Visibility Settings</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isPublic"
                              name="isPublic"
                              checked={formData.isPublic}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="isPublic">
                              Make this pageant publicly visible in pageant listings
                            </label>
                          </div>
                          
                          <div className="alert alert-info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            <small>
                              When a pageant is public, it will be visible in the public pageant listings, and contestants will be able to find and register for it using the pageant ID.<br /><br />
                              If a pageant is not public, it will only be visible to you and your organization. Contestants will still be able to register if they have the pageant ID.
                            </small>
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
                }}
            >
              <button 
                type="button" 
                className="btn btn-secondary me-2" 
                onClick={onClose}
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
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EditPageantModal.propTypes = {
  pageant: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default EditPageantModal;
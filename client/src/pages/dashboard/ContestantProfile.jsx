// client/src/pages/dashboard/ContestantProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faIdCard,
  faNotesMedical,
  faPhone,
  faInfoCircle,
  faImage,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../../css/contestantProfile.css';

const ContestantProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    // Basic info (from registration)
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    dateOfBirth: '',
    // Additional profile info
    biography: '',
    funFact: '',
    hairColor: '',
    eyeColor: '',
    // Emergency contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Medical info
    allergies: '',
    medicalConditions: '',
    // Proof of age
    proofOfAge: null,
    proofOfAgeType: 'birth-certificate', // or 'id'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch contestant profile data
    const fetchProfileData = async () => {
      try {
        // In a real app, you'd fetch this from your API
        // For now, we'll use the user data from auth context and mock the rest
        if (user) {
          setProfileData(prevData => ({
            ...prevData,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            username: user.username || '',
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          }));
        }
        
        // Mock API call for additional profile data
        // In a real app, you would fetch this data from your backend
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setErrorMessage('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prevData => ({
        ...prevData,
        proofOfAge: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // In a real app, you'd send this data to your API
      console.log('Profile data to submit:', profileData);

      // Mock API call
      setTimeout(() => {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="contestant-profile">
      <div className="profile-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="u-text-dark mb-1">My Profile</h2>
          <p className="u-text-dark">Manage your personal information</p>
        </div>
        <div>
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit Profile
            </button>
          ) : (
            <button 
              className="btn btn-secondary ms-2"
              onClick={() => setIsEditing(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Profile Nav Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Basic Information
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            About Me
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            <FontAwesomeIcon icon={faPhone} className="me-2" />
            Emergency Contact
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
            Medical Information
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FontAwesomeIcon icon={faIdCard} className="me-2" />
            Documents
          </button>
        </li>
      </ul>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className={`tab-pane ${activeTab === 'basic' ? 'd-block' : 'd-none'}`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Basic Information</h4>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profileData.firstName}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profileData.lastName}</p>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profileData.email}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profileData.username}</p>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{formatDate(profileData.dateOfBirth)}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Age Group</label>
                  <p className="form-control-plaintext">{user?.ageGroup || 'Not calculated'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className={`tab-pane ${activeTab === 'appearance' ? 'd-block' : 'd-none'}`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">About Me</h4>
              
              <div className="mb-3">
                <label className="form-label">Biography</label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    name="biography"
                    value={profileData.biography}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself, your interests, hobbies, and aspirations..."
                  ></textarea>
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.biography || 'No biography provided yet.'}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Fun Fact</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="funFact"
                    value={profileData.funFact}
                    onChange={handleInputChange}
                    placeholder="Share something interesting about yourself!"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.funFact || 'No fun fact provided yet.'}
                  </p>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Hair Color</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="hairColor"
                      value={profileData.hairColor}
                      onChange={handleInputChange}
                      placeholder="E.g., Brown, Blonde, Black, Red"
                    />
                  ) : (
                    <p className="form-control-plaintext">
                      {profileData.hairColor || 'Not specified'}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Eye Color</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="eyeColor"
                      value={profileData.eyeColor}
                      onChange={handleInputChange}
                      placeholder="E.g., Brown, Blue, Green, Hazel"
                    />
                  ) : (
                    <p className="form-control-plaintext">
                      {profileData.eyeColor || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={`tab-pane ${activeTab === 'emergency' ? 'd-block' : 'd-none'}`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Emergency Contact</h4>
              
              <div className="alert alert-info" role="alert">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Please provide an emergency contact who can be reached during pageant events.
              </div>
              
              <div className="mb-3">
                <label className="form-label">Emergency Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Full name of emergency contact"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.emergencyContactName || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Emergency Contact Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-control"
                    name="emergencyContactPhone"
                    value={profileData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Emergency contact phone number"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.emergencyContactPhone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className={`tab-pane ${activeTab === 'medical' ? 'd-block' : 'd-none'}`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Medical Information</h4>
              
              <div className="alert alert-info" role="alert">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                This information will only be used in case of emergency. It will be kept confidential.
              </div>
              
              <div className="mb-3">
                <label className="form-label">Allergies</label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="List any allergies you have. If none, enter 'None'"
                  ></textarea>
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.allergies || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    name="medicalConditions"
                    value={profileData.medicalConditions}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="List any medical conditions that organizers should be aware of. If none, enter 'None'"
                  ></textarea>
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.medicalConditions || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className={`tab-pane ${activeTab === 'documents' ? 'd-block' : 'd-none'}`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Proof of Age</h4>
              
              <div className="alert alert-warning" role="alert">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Please upload a copy of your birth certificate or government ID to verify your age. This is required for pageant eligibility.
              </div>
              
              <div className="mb-3">
                <label className="form-label">Document Type</label>
                {isEditing ? (
                  <select 
                    className="form-select"
                    name="proofOfAgeType"
                    value={profileData.proofOfAgeType}
                    onChange={handleInputChange}
                  >
                    <option value="birth-certificate">Birth Certificate</option>
                    <option value="id">Government ID</option>
                  </select>
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.proofOfAgeType === 'birth-certificate' ? 'Birth Certificate' : 'Government ID'}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Document</label>
                {isEditing ? (
                  <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                ) : (
                  <div>
                    {profileData.proofOfAge ? (
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        <span>Document uploaded</span>
                      </div>
                    ) : (
                      <p className="text-danger">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                        No document uploaded yet
                      </p>
                    )}
                  </div>
                )}
                <small className="form-text text-muted">
                  Accepted formats: JPG, PNG, PDF. Max file size: 5MB
                </small>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end mt-4">
            <button 
              type="submit"
              className="btn btn-success"
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
        )}
      </form>
    </div>
  );
};

export default ContestantProfile;
// client/src/pages/dashboard/ContestantProfile.jsx - REFACTORED VERSION
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faIdCard,
  faNotesMedical,
  faPhone,
  faInfoCircle,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  TabNavigation, 
  LoadingSpinner, 
  ErrorAlert,
  ActionButton 
} from '../../components/dashboard/common';

// Import specialized components
import { ProfileCompletionCard } from '../../components/dashboard/contestant';

// Import services and utilities
import { 
  getContestantProfile, 
  updateContestantProfile, 
  getProfileCompleteness 
} from '../../services/profileService';
import { formatDate } from '../../utils';

import '../../css/contestantProfile.css';

const ContestantProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
    emergencyContactRelationship: '',
    // Medical info
    allergies: '',
    medicalConditions: '',
    // Proof of age
    proofOfAgeType: 'birth-certificate',
    proofOfAgeFile: null
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [completeness, setCompleteness] = useState(0);

  // Tab configuration
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: faUser
    },
    {
      id: 'appearance',
      label: 'About Me',
      icon: faInfoCircle
    },
    {
      id: 'emergency',
      label: 'Emergency Contact',
      icon: faPhone
    },
    {
      id: 'medical',
      label: 'Medical Information',
      icon: faNotesMedical
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: faIdCard
    }
  ];

  useEffect(() => {
    // Fetch contestant profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getContestantProfile();
        
        if (response.success) {
          const { user: userData, profile } = response.contestant;
          
          // Prepare profile data object
          const newProfileData = {
            // Basic info from user
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            username: userData.username || '',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
            
            // Profile info
            biography: profile?.biography || '',
            funFact: profile?.funFact || '',
            hairColor: profile?.appearance?.hairColor || '',
            eyeColor: profile?.appearance?.eyeColor || '',
            
            // Emergency contact
            emergencyContactName: profile?.emergencyContact?.name || '',
            emergencyContactPhone: profile?.emergencyContact?.phone || '',
            emergencyContactRelationship: profile?.emergencyContact?.relationship || '',
            
            // Medical info
            allergies: profile?.medicalInformation?.allergies || '',
            medicalConditions: profile?.medicalInformation?.medicalConditions || '',
            
            // Document info
            proofOfAgeType: profile?.documents?.proofOfAgeType || 'birth-certificate',
            proofOfAgeFile: profile?.documents?.proofOfAgeFile || null
          };
          
          // Set profile data and keep a copy for tracking changes
          setProfileData(newProfileData);
          setOriginalData(newProfileData);
          
          // Set completeness
          setCompleteness(profile?.profileCompleteness || 0);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Prepare data for API
      const updateData = {
        biography: profileData.biography,
        funFact: profileData.funFact,
        hairColor: profileData.hairColor,
        eyeColor: profileData.eyeColor,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContactPhone: profileData.emergencyContactPhone,
        emergencyContactRelationship: profileData.emergencyContactRelationship,
        allergies: profileData.allergies,
        medicalConditions: profileData.medicalConditions,
        proofOfAgeType: profileData.proofOfAgeType
      };

      const response = await updateContestantProfile(updateData);
      
      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        
        // Update completeness
        const completenessResponse = await getProfileCompleteness();
        if (completenessResponse.success) {
          setCompleteness(completenessResponse.completeness);
        }
        
        // Update original data reference to reflect the saved changes
        setOriginalData({...profileData});
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEditing = () => {
    // Revert changes by restoring from original data
    setProfileData({...originalData});
    setIsEditing(false);
  };

  if (loading && !user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="contestant-profile">
      <DashboardPageHeader 
        title="My Profile"
        subtitle="Manage your personal information"
      >
        {!isEditing ? (
          <ActionButton 
            variant="primary"
            icon={faEdit}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </ActionButton>
        ) : (
          <ActionButton 
            variant="secondary"
            icon={faTimes}
            onClick={cancelEditing}
          >
            Cancel
          </ActionButton>
        )}
      </DashboardPageHeader>

      {/* Profile Completeness */}
      <ProfileCompletionCard completeness={completeness} />

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <ErrorAlert message={errorMessage} />
      )}

      {/* Profile Nav Tabs */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <form onSubmit={handleSubmit}>
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
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
        )}

        {/* About Me Tab */}
        {activeTab === 'appearance' && (
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
        )}

        {/* Emergency Contact Tab */}
        {activeTab === 'emergency' && (
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

              <div className="mb-3">
                <label className="form-label">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="emergencyContactRelationship"
                    value={profileData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    placeholder="E.g., Parent, Guardian, Spouse, Sibling"
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.emergencyContactRelationship || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medical Information Tab */}
        {activeTab === 'medical' && (
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
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Proof of Age</h4>
              
              <div className="alert alert-warning" role="alert">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Document upload functionality will be implemented soon. Please check back later.
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
                    <option value="passport">Passport</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="form-control-plaintext">
                    {profileData.proofOfAgeType === 'birth-certificate' ? 'Birth Certificate' : 
                     profileData.proofOfAgeType === 'id' ? 'Government ID' : 
                     profileData.proofOfAgeType === 'passport' ? 'Passport' : 'Other'}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <p className="form-control-plaintext">
                  Document upload functionality coming soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <div className="d-flex justify-content-end mt-4">
            <ActionButton 
              type="submit"
              variant="success"
              icon={faSave}
              loading={updating}
              disabled={updating}
            >
              Save Changes
            </ActionButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContestantProfile;
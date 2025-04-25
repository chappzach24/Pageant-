// client/src/pages/dashboard/JoinPageant.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faIdCard,
  faImage,
  faFileSignature,
  faArrowRight,
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { getContestantProfile } from '../../services/profileService';
import '../../css/joinPageant.css';
import '../../css/joinPageantSteps.css';

const JoinPageant = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [pageantId, setPageantId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [pageantFound, setPageantFound] = useState(false);
  const [pageantDetails, setPageantDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [faceImage, setFaceImage] = useState(null);
  const [fullBodyImage, setFullBodyImage] = useState(null);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  // Add state for contestant profile data
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [eligibleAgeGroup, setEligibleAgeGroup] = useState('');
  
  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch contestant profile data
  useEffect(() => {
    const fetchContestantProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        setProfileError(null);
        
        const response = await getContestantProfile();
        if (response.success) {
          console.log('Contestant profile data:', response.contestant);
          setProfileData(response.contestant);
        } else {
          throw new Error('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching contestant profile:', error);
        setProfileError('Failed to load your profile information. Please try again.');
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchContestantProfile();
  }, [user]);
  
  // Determine eligible age group when pageant is found
  useEffect(() => {
    if (pageantFound && pageantDetails && profileData) {
      determineEligibleAgeGroup();
    }
  }, [pageantFound, pageantDetails, profileData]);
  
  // Function to determine the contestant's age group
  const determineEligibleAgeGroup = () => {
    if (!profileData || !profileData.user || !profileData.user.dateOfBirth || !pageantDetails.competitionYear) {
      console.log('Missing data for age calculation:', {
        profileData: !!profileData,
        user: profileData && !!profileData.user,
        dateOfBirth: profileData && profileData.user && !!profileData.user.dateOfBirth,
        competitionYear: pageantDetails && !!pageantDetails.competitionYear
      });
      setEligibleAgeGroup('Unknown');
      return;
    }
    
    try {
      // Create a Date object from the user's date of birth
      const birthDate = new Date(profileData.user.dateOfBirth);
      
      // Check if the date is valid
      if (isNaN(birthDate.getTime())) {
        console.error('Invalid birth date:', profileData.user.dateOfBirth);
        setEligibleAgeGroup('Unknown');
        return;
      }
      
      // Calculate age as of January 1st of the competition year
      const januaryFirst = new Date(pageantDetails.competitionYear, 0, 1);
      
      let age = januaryFirst.getFullYear() - birthDate.getFullYear();
      
      // Adjust age if birthday hasn't occurred yet by January 1st
      if (birthDate.getMonth() > 0 || (birthDate.getMonth() === 0 && birthDate.getDate() > 1)) {
        age--; 
      }
      
      console.log('Age calculation:', {
        birthDate: birthDate.toISOString(),
        competitionYear: pageantDetails.competitionYear,
        januaryFirst: januaryFirst.toISOString(),
        calculatedAge: age
      });
      
      // Determine age group based on age
      let ageGroup;
      if (age >= 5 && age <= 8) ageGroup = '5 - 8 Years';
      else if (age >= 9 && age <= 12) ageGroup = '9 - 12 Years';
      else if (age >= 13 && age <= 18) ageGroup = '13 - 18 Years';
      else if (age >= 19 && age <= 39) ageGroup = '19 - 39 Years';
      else if (age >= 40) ageGroup = '40+ Years';
      else ageGroup = 'Not Eligible';
      
      setEligibleAgeGroup(ageGroup);
    } catch (error) {
      console.error('Error determining age group:', error);
      setEligibleAgeGroup('Unknown');
    }
  };
  
  // Handle category selection
  const handleCategorySelection = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // Function to search for pageant by ID
  const searchPageant = async () => {
    if (!pageantId.trim()) {
      setErrorMessage('Please enter a pageant ID');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    try {
      // Make API request to search for pageant
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pageants/search/${pageantId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to find pageant with that ID');
      }

      const data = await response.json();
      
      if (data.success && data.pageant) {
        setPageantFound(true);
        setPageantDetails(data.pageant);
        // Reset selected categories
        setSelectedCategories([]);
      } else {
        setPageantFound(false);
        setErrorMessage('Pageant not found. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Error searching for pageant:', error);
      setPageantFound(false);
      setErrorMessage(error.message || 'Failed to search for pageant. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Handle file uploads
  const handleFileChange = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      setImageFunction(file);
    }
  };

  // Next step function
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Previous step function
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit registration function
  const submitRegistration = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Prepare registration data
      const registrationData = {
        pageantId: pageantDetails._id,
        categories: selectedCategories
      };
      
      // Call API to register for pageant
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/participants`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(registrationData)
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for pageant');
      }
      
      // Set success and move to success view
      setSubmissionSuccess(true);
    } catch (error) {
      console.error('Error registering for pageant:', error);
      setErrorMessage(error.message || 'Failed to register for pageant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form if the user wants to register for another pageant
  const resetForm = () => {
    setCurrentStep(1);
    setPageantId('');
    setPageantFound(false);
    setPageantDetails(null);
    setErrorMessage('');
    setFaceImage(null);
    setFullBodyImage(null);
    setHasAgreedToTerms(false);
    setSubmissionSuccess(false);
    setSelectedCategories([]);
  };

  // Render loading state if profile is loading
  if (profileLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="join-pageant-container">
      <div className="page-header mb-4">
        <h2 className="u-text-dark mb-1">Join a Pageant</h2>
        <p className="u-text-dark">Register for a pageant by entering the pageant ID</p>
      </div>

      {/* Display profile error if there is one */}
      {profileError && (
        <div className="alert alert-danger mb-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {profileError}
        </div>
      )}

      {/* Success message */}
      {submissionSuccess ? (
        <div className="success-container text-center p-5">
          <div className="icon-container mb-4">
            <FontAwesomeIcon icon={faCheckCircle} size="5x" className="text-success" />
          </div>
          <h3 className="mb-3">Registration Successful!</h3>
          <p className="mb-4">You have successfully registered for {pageantDetails.name}. The pageant organizers will review your submission and contact you with next steps.</p>
          <button className="btn btn-primary" onClick={resetForm}>
            Register for Another Pageant
          </button>
        </div>
      ) : (
        <>
          {/* Step indicators with clear separation between circles and connecting lines */}
          <div className="steps-indicator mb-4">
            {/* Step indicators remain the same */}
            <div className={`join-step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="join-step-circle">1</div>
              <div className="join-step-label">Find Pageant</div>
            </div>
            
            <div className={`join-step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            
            <div className={`join-step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="join-step-circle">2</div>
              <div className="join-step-label">Verify Info</div>
            </div>
            
            <div className={`join-step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            
            <div className={`join-step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="join-step-circle">3</div>
              <div className="join-step-label">Upload Photos</div>
            </div>
            
            <div className={`join-step-line ${currentStep >= 4 ? 'active' : ''}`}></div>
            
            <div className={`join-step-item ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="join-step-circle">4</div>
              <div className="join-step-label">Sign Waivers</div>
            </div>
          </div>

          {/* Step 1: Enter Pageant ID */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Enter Pageant ID</h4>
                  
                  <p className="text-muted mb-4">
                    Enter the pageant ID provided by the pageant organizer. 
                    This can usually be found on the pageant's marketing materials or website.
                  </p>
                  
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pageant ID (e.g., PAG12345)"
                      value={pageantId}
                      onChange={(e) => setPageantId(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={searchPageant}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                      )}
                      Search
                    </button>
                  </div>
                  
                  {/* Display pageant details if found */}
                  {pageantFound && pageantDetails && (
                    <div className="pageant-details mt-4">
                      <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                        <div>Pageant found! Review the details below.</div>
                      </div>
                      
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5 className="card-title">{pageantDetails.name}</h5>
                          <p className="card-text">
                            <strong>Organized by:</strong> {pageantDetails.organization.name}
                          </p>
                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p className="mb-1"><strong>Dates:</strong> {formatDate(pageantDetails.startDate)} - {formatDate(pageantDetails.endDate)}</p>
                              <p className="mb-1"><strong>Location:</strong> {pageantDetails.location?.venue || 'Online'}, {pageantDetails.location?.address?.city || ''}{pageantDetails.location?.address?.state ? `, ${pageantDetails.location.address.state}` : ''}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1"><strong>Registration Deadline:</strong> {formatDate(pageantDetails.registrationDeadline)}</p>
                              <p className="mb-1"><strong>Entry Fee:</strong> {pageantDetails.entryFee?.currency || 'USD'} {pageantDetails.entryFee?.amount}</p>
                            </div>
                          </div>
                          <p className="mb-1"><strong>Categories:</strong> {pageantDetails.categories.map(cat => typeof cat === 'string' ? cat : cat.name).join(", ")}</p>
                          <p><strong>Age Groups:</strong> {pageantDetails.ageGroups.join(", ")}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button 
                          className="btn btn-primary"
                          onClick={nextStep}
                        >
                          Continue <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Verify Contestant Information */}
          {currentStep === 2 && pageantDetails && profileData && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Verify Your Information</h4>
                  
                  <p className="text-muted mb-4">
                    Please verify that your personal information is correct before proceeding. 
                    This information will be used for your pageant registration.
                  </p>
                  
                  {/* Basic Personal Information */}
                  <div className="contestant-info mb-4">
                    <h5 className="mb-3">Personal Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Full Name:</label>
                          <span>{profileData.user.firstName} {profileData.user.lastName}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Email:</label>
                          <span>{profileData.user.email}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Date of Birth:</label>
                          <span>{formatDate(profileData.user.dateOfBirth)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Age Group:</label>
                          <span className={pageantDetails.ageGroups.includes(eligibleAgeGroup) ? 'text-success' : 'text-danger'}>
                            {eligibleAgeGroup}
                            {!pageantDetails.ageGroups.includes(eligibleAgeGroup) && (
                              <span className="ms-2 text-danger">
                                <FontAwesomeIcon icon={faExclamationTriangle} /> Not eligible for this pageant
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Appearance Information */}
                  <div className="contestant-appearance mb-4">
                    <h5 className="mb-3">Appearance Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Hair Color:</label>
                          <span>
                            {profileData.profile?.appearance?.hairColor || 
                              <span className="text-muted">Not specified</span>}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Eye Color:</label>
                          <span>
                            {profileData.profile?.appearance?.eyeColor || 
                              <span className="text-muted">Not specified</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact Information */}
                  <div className="emergency-contact mb-4">
                    <h5 className="mb-3">Emergency Contact</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Contact Name:</label>
                          <span>
                            {profileData.profile?.emergencyContact?.name || 
                              <span className="text-muted">Not specified</span>}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Contact Phone:</label>
                          <span>
                            {profileData.profile?.emergencyContact?.phone || 
                              <span className="text-muted">Not specified</span>}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Relationship:</label>
                          <span>
                            {profileData.profile?.emergencyContact?.relationship || 
                              <span className="text-muted">Not specified</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medical Information */}
                  <div className="medical-info mb-4">
                    <h5 className="mb-3">Medical Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Allergies:</label>
                          <span>
                            {profileData.profile?.medicalInformation?.allergies || 
                              <span className="text-muted">None specified</span>}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-bold d-block">Medical Conditions:</label>
                          <span>
                            {profileData.profile?.medicalInformation?.medicalConditions || 
                              <span className="text-muted">None specified</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Completeness Warning (if applicable) */}
                  {profileData.profile?.profileCompleteness < 100 && (
                    <div className="alert alert-warning mb-4">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                      Your profile is only {profileData.profile.profileCompleteness}% complete. 
                      Consider <Link to="/contestant-dashboard/profile" className="alert-link">updating your profile</Link> with 
                      complete information before registering for pageants.
                    </div>
                  )}
                  
                  {/* Category Selection (only if eligible age group) */}
                  {pageantDetails.ageGroups.includes(eligibleAgeGroup) && (
                    <div className="category-selection mb-4">
                      <h5 className="mb-3">Select Categories</h5>
                      <p className="text-muted mb-3">Please select the categories you would like to compete in:</p>
                      
                      <div className="categories-list">
                        {pageantDetails.categories.map((category, index) => {
                          const categoryName = typeof category === 'string' ? category : category.name;
                          return (
                            <div className="form-check mb-2" key={index}>
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`category-${index}`}
                                checked={selectedCategories.includes(categoryName)}
                                onChange={() => handleCategorySelection(categoryName)}
                              />
                              <label className="form-check-label" htmlFor={`category-${index}`}>
                                {categoryName}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedCategories.length === 0 && (
                        <div className="alert alert-warning mt-3">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                          Please select at least one category to continue.
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Eligibility Warning or Navigation Buttons */}
                  {!pageantDetails.ageGroups.includes(eligibleAgeGroup) ? (
                    <div className="alert alert-danger" role="alert">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                      Unfortunately, you are not eligible to participate in this pageant based on your age group.
                      Please check other pageants that include your age group.
                    </div>
                  ) : (
                    <div className="button-group d-flex justify-content-between mt-4">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={prevStep}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Back
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={nextStep}
                        disabled={selectedCategories.length === 0}
                      >
                        Continue <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Upload Photos */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Upload Required Photos</h4>
                  
                  <p className="text-muted mb-4">
                    Please upload clear, recent photos for your pageant application. 
                    The photos will be reviewed by the pageant organizers.
                  </p>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="upload-container">
                        <h5 className="mb-3">Headshot / Face Photo</h5>
                        <div 
                          className="upload-area p-4 text-center"
                          onClick={() => document.getElementById('facePhotoInput').click()}
                        >
                          {faceImage ? (
                            <div>
                              <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="2x" />
                              <p className="mb-0">Uploaded: {faceImage.name}</p>
                            </div>
                          ) : (
                            <div>
                              <FontAwesomeIcon icon={faImage} className="mb-3" size="2x" />
                              <p>Click to upload or drag and drop</p>
                              <p className="small text-muted mb-0">JPG, PNG or HEIC (max 5MB)</p>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          id="facePhotoInput" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setFaceImage)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="upload-container">
                        <h5 className="mb-3">Full Body Photo</h5>
                        <div 
                          className="upload-area p-4 text-center"
                          onClick={() => document.getElementById('fullBodyPhotoInput').click()}
                        >
                          {fullBodyImage ? (
                            <div>
                              <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="2x" />
                              <p className="mb-0">Uploaded: {fullBodyImage.name}</p>
                            </div>
                          ) : (
                            <div>
                              <FontAwesomeIcon icon={faImage} className="mb-3" size="2x" />
                              <p>Click to upload or drag and drop</p>
                              <p className="small text-muted mb-0">JPG, PNG or HEIC (max 5MB)</p>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          id="fullBodyPhotoInput" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setFullBodyImage)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="button-group d-flex justify-content-between mt-4">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={prevStep}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={nextStep}
                      disabled={!faceImage || !fullBodyImage}
                    >
                      Continue <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Sign Waivers */}
          {currentStep === 4 && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Terms & Agreements</h4>
                  
                  <p className="text-muted mb-4">
                    Please read and agree to the following terms and waivers before completing your registration.
                  </p>
                  
                  <div className="waiver-container mb-4">
                    <h5 className="mb-3">Pageant Participation Agreement</h5>
                    <div className="card">
                      <div className="card-header bg-light">
                        <strong>Pageant Rules & Regulations</strong>
                      </div>
                      <div className="card-body bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <p>
                          By participating in this pageant, you agree to abide by all the rules and regulations set forth by the pageant organizers. You understand that the judges' decisions are final and binding.
                        </p>
                        <p>
                          You grant permission for your photos and videos taken during the pageant to be used for promotional purposes by the pageant organization. You also acknowledge that the entry fee is non-refundable.
                        </p>
                        <p>
                          Furthermore, you agree to conduct yourself with dignity and respect towards all participants, staff, and volunteers associated with the pageant. Any violation of these terms may result in disqualification without refund.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-check mb-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="agreementCheck"
                      checked={hasAgreedToTerms}
                      onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="agreementCheck">
                      I have read and agree to the terms and conditions above
                    </label>
                  </div>
                  
                  {/* Fee Summary */}
                  <div className="fee-summary mb-4">
                    <h5 className="mb-3">Registration Fee Summary</h5>
                    <div className="card">
                      <div className="card-header bg-light">
                        <strong>Payment Details</strong>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Base Entry Fee:</span>
                          <span>{pageantDetails.entryFee?.currency || 'USD'} {pageantDetails.entryFee?.amount || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Selected Categories:</span>
                          <span>{selectedCategories.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <span>Category Fee:</span>
                          <span>{pageantDetails.entryFee?.currency || 'USD'} {selectedCategories.length * 5}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total:</span>
                          <span>{pageantDetails.entryFee?.currency || 'USD'} {(pageantDetails.entryFee?.amount || 0) + (selectedCategories.length * 5)}</span>
                        </div>
                        <p className="small text-muted mt-2">Payment will be collected after your registration is approved.</p>
                      </div>
                    </div>
                  </div>
                  
                  {errorMessage && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="button-group d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={prevStep}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={submitRegistration}
                      disabled={!hasAgreedToTerms || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faFileSignature} className="me-2" />
                          Complete Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JoinPageant;
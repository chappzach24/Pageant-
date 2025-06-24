// client/src/pages/dashboard/JoinPageant.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getContestantProfile } from '../../services/profileService';
import Step1FindPageant from '../../components/dashboard/joinPageant/Step1FindPageant';
import Step2VerifyInfo from '../../components/dashboard/joinPageant/Step2VerifyInfo';
import Step3UploadPhotos from '../../components/dashboard/joinPageant/Step3UploadPhotos';
import Step4SignWaivers from '../../components/dashboard/joinPageant/Step4SignWaivers';
import '../../css/joinPageantSteps.css';
import '../../css/joinPageant.css';

const JoinPageant = () => {
  const { user } = useAuth();
  
  // Profile data state
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [pageantId, setPageantId] = useState('');
  const [pageantFound, setPageantFound] = useState(false);
  const [pageantDetails, setPageantDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  // Photo and form states
  const [faceImage, setFaceImage] = useState(null);
  const [fullBodyImage, setFullBodyImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  
  // Load contestant profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        setProfileError(null);
        const profile = await getContestantProfile();
        console.log(profile);
        setProfileData(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfileError(error.message || 'Failed to load profile data');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateEligibleAgeGroup = () => {
    if (!profileData?.contestant?.user?.dateOfBirth) return 'Unknown';
    
    const year = new Date().getFullYear();
    const januaryFirst = new Date(year, 0, 1);
    const birthDate = new Date(profileData?.contestant?.user?.dateOfBirth);
    
    let age = januaryFirst.getFullYear() - birthDate.getFullYear();
    
    if (birthDate.getMonth() > 0 || birthDate.getDate() > 1) {
      age--;
    }
    
    if (age >= 5 && age <= 8) return '5 - 8 Years';
    else if (age >= 9 && age <= 12) return '9 - 12 Years';
    else if (age >= 13 && age <= 18) return '13 - 18 Years';
    else if (age >= 19 && age <= 39) return '19 - 39 Years';
    else if (age >= 40) return '40+ Years';
    return 'Not Eligible';
  };

  const eligibleAgeGroup = calculateEligibleAgeGroup();

  // API functions
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
            'Accept': 'application/json'
          }
        }
      );

      const data = await response.json();

       if (!response.ok) {
        // Display the specific error message from the backend
        setPageantFound(false);
        setErrorMessage(data.error || 'Failed to find pageant with that ID');
        return;
      }
      
      if (data.success && data.pageant) {
        console.log("Pageant", data.pageant);
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

  const submitRegistration = async () => {
    if (!hasAgreedToTerms) {
      setErrorMessage('You must agree to the terms and conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmissionSuccess(true);
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completePayment = () => {
    setSubmissionSuccess(true);
  };

  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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

  // Step definitions for indicator
  const steps = [
    { number: 1, label: 'Find Pageant' },
    { number: 2, label: 'Verify Info' },
    { number: 3, label: 'Upload Photos' },
    { number: 4, label: 'Sign Waivers' },
  ];

  // Loading state
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {profileError}
        </div>
      )}

      {/* Success message */}
      {submissionSuccess ? (
        <div className="success-container text-center p-5">
          <div className="icon-container mb-4">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-success">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mb-3">Registration Successful!</h3>
          <p className="mb-4">
            You have successfully registered for {pageantDetails?.name}. 
            The pageant organizers will review your submission and contact you with next steps.
          </p>
          <button className="btn btn-primary" onClick={resetForm}>
            Register for Another Pageant
          </button>
        </div>
      ) : (
        <>
          {/* Step indicators */}
          <div className="steps-indicator mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`join-step-item ${currentStep >= step.number ? 'active' : ''}`}>
                  <div className="join-step-circle">{step.number}</div>
                  <div className="join-step-label">{step.label}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`join-step-line ${currentStep >= step.number + 1 ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          

          {/* Step Content */}
          {currentStep === 1 && (
            <Step1FindPageant
              pageantId={pageantId}
              setPageantId={setPageantId}
              errorMessage={errorMessage}
              isSearching={isSearching}
              searchPageant={searchPageant}
              pageantFound={pageantFound}
              pageantDetails={pageantDetails}
              onNextStep={nextStep}
            />
          )}

          {currentStep === 2 && pageantDetails && profileData && (
            <Step2VerifyInfo
              pageantDetails={pageantDetails}
              profileData={profileData}
              eligibleAgeGroup={eligibleAgeGroup}
              formatDate={formatDate}
              onPrevStep={prevStep}
              onNextStep={nextStep}
            />
          )}

          {currentStep === 3 && (
            <Step3UploadPhotos
              faceImage={faceImage}
              setFaceImage={setFaceImage}
              fullBodyImage={fullBodyImage}
              setFullBodyImage={setFullBodyImage}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              pageantDetails={pageantDetails}
              onPrevStep={prevStep}
              onNextStep={nextStep}
            />
          )}

          {currentStep === 4 && (
            <Step4SignWaivers
              hasAgreedToTerms={hasAgreedToTerms}
              setHasAgreedToTerms={setHasAgreedToTerms}
              pageantDetails={pageantDetails}
              selectedCategories={selectedCategories}
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              onPrevStep={prevStep}
              profileData={profileData}
              onSubmitRegistration={nextStep} // Move to checkout instead of submitting
            />
          )}
        </>
      )}
    </div>
  );
};

export default JoinPageant;
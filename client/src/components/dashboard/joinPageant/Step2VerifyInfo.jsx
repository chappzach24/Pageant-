// client/src/components/dashboard/joinPageant/Step2VerifyInfo.jsx
import React from 'react';

const Step2VerifyInfo = ({ 
  pageantDetails, 
  profileData, 
  eligibleAgeGroup, 
  formatDate, 
  onPrevStep, 
  onNextStep 
}) => {
  return (
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
                  <span>{profileData?.contestant?.user?.firstName} {profileData?.contestant?.user?.lastName}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Email:</label>
                  <span>{profileData?.contestant?.user?.email}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Date of Birth:</label>
                  <span>{formatDate(profileData?.contestant?.user?.dateOfBirth)}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Age Group:</label>
                  <span className={profileData?.contestant?.user?.ageGroup.includes(eligibleAgeGroup) ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                    {eligibleAgeGroup}
                    {profileData?.contestant?.user?.ageGroup.includes(eligibleAgeGroup) ? 
                      ' ✓ Eligible' : 
                      ' ✗ Not eligible for this pageant'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Profile Information */}
          <div className="additional-info mb-4">
            <h5 className="mb-3">Additional Information</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Height:</label>
                  <span>{profileData?.contestant?.height || 'Not specified'}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Hair Color:</label>
                  <span>{profileData?.contestant?.profile?.appearance?.hairColor || 'Not specified'}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">Eye Color:</label>
                  <span>{profileData?.contestant?.profile?.appearance?.eyeColor || 'Not specified'}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold d-block">City, State:</label>
                  <span>{profileData?.city && profileData?.state ? 
                    `${profileData.city}, ${profileData.state}` : 
                    'Not specified'
                  }</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pageant Eligibility Alert */}
          {pageantDetails?.ageGroups?.includes(eligibleAgeGroup) ? (
            <div className="alert alert-success d-flex align-items-center mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <strong>Eligible!</strong> You meet the age requirements for this pageant.
              </div>
            </div>
          ) : (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Not Eligible.</strong> Your age group ({eligibleAgeGroup}) is not accepted for this pageant. 
                Accepted age groups: {pageantDetails?.ageGroups?.join(', ')}
              </div>
            </div>
          )}

          {/* Profile Completion Notice */}
          {(!profileData?.height || !profileData?.hairColor || !profileData?.eyeColor) && (
            <div className="alert alert-warning d-flex align-items-center mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Incomplete Profile.</strong> Some information is missing from your profile. 
                You can update this in your profile settings after registration.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="button-group d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary"
              onClick={onPrevStep}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <path d="m12 19-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={onNextStep}
              disabled={!pageantDetails?.ageGroups?.includes(eligibleAgeGroup)}
            >
              Continue 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ms-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2VerifyInfo;
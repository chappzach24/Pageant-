// client/src/components/dashboard/joinPageant/Step1FindPageant.jsx
import React from 'react';

const Step1FindPageant = ({ 
  pageantId, 
  setPageantId, 
  errorMessage, 
  isSearching, 
  searchPageant,
  pageantFound,
  pageantDetails,
  onNextStep
}) => {

  function formatAddress(location) {
    if (!location || !location.address) return "";

    const { street, city, state, zipCode, country } = location.address;

    // Combine parts, filtering out undefined or empty values
    const parts = [street, city, state, zipCode, country].filter(Boolean);
    
    return parts.join(', ');
  }


  return (
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
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Searching...
                </>
              ) : (
                'Search Pageant'
              )}
            </button>
          </div>
          
          {/* Display pageant details if found */}
          {pageantFound && pageantDetails && (
            <div className="pageant-details mt-4">
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                  <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pageant found! Please review the details below.
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{pageantDetails.name}</h5>
                </div>
                <div className="card-body">
                  {/* First Row - Basic Information */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Organization:</strong></p>
                        <p className="info-value">{pageantDetails.organization?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Date:</strong></p>
                        <p className="info-value">{new Date(pageantDetails.startDate).toLocaleDateString()} - {new Date(pageantDetails.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Location:</strong></p>
                        <p className="info-value">{formatAddress(pageantDetails.location) || 'TBD'}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Entry Fee:</strong></p>
                        <p className="info-value">${pageantDetails.entryFee?.amount || 0}.00</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second Row - Additional Information */}
                  <div className="row">
                    <div className="col-md-4">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Description:</strong></p>
                        <p className="info-value text-muted">{pageantDetails.description}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Categories:</strong></p>
                        <p className="info-value">{pageantDetails.categories?.map(cat => typeof cat === 'string' ? cat : cat.name).join(", ")}</p>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="info-item">
                        <p className="info-label mb-1"><strong>Age Groups:</strong></p>
                        <p className="info-value">{pageantDetails.ageGroups?.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      className="btn btn-primary"
                      onClick={onNextStep}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1FindPageant;
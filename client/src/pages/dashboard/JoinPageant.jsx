// client/src/pages/dashboard/JoinPageant.jsx (Updated with fixed step indicator styling)
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faIdCard,
  faImage,
  faFileSignature,
  faArrowRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import '../../css/joinPageant.css';
import '../../css/joinPageantSteps.css'; // Import the updated CSS file for steps

const JoinPageant = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Enter pageant ID
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

  // Mock pageant details for frontend development
  const mockPageantDetails = {
    id: 'PAG12345',
    name: 'Summer Elegance 2025',
    organization: 'Coastal Pageants Inc.',
    startDate: '2025-06-15',
    endDate: '2025-06-20',
    location: 'Oceanview Convention Center, Miami',
    registrationDeadline: '2025-05-15',
    ageGroups: ['5 - 8 Years', '9 - 12 Years', '13 - 18 Years', '19 - 39 Years', '40+ Years'],
    categories: [
      'Evening Gown',
      'Talent',
      'Interview',
      'Swimwear',
      'Photogenic'
    ],
    entryFee: '$75.00',
    additionalFees: [
      { name: 'Photogenic Entry', amount: '$25.00' },
      { name: 'Talent Showcase', amount: '$30.00' }
    ],
    waiverDocument: 'https://example.com/waiver.pdf'
  };

  // Function to search for pageant by ID
  const searchPageant = () => {
    if (!pageantId.trim()) {
      setErrorMessage('Please enter a pageant ID');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    // Mock API call - in real implementation, this would be an API request
    setTimeout(() => {
      // Simulate finding the pageant if ID starts with "PAG"
      if (pageantId.toUpperCase().startsWith('PAG')) {
        setPageantFound(true);
        setPageantDetails(mockPageantDetails);
      } else {
        setPageantFound(false);
        setErrorMessage('Pageant not found. Please check the ID and try again.');
      }
      setIsSearching(false);
    }, 1000);
  };

  // Function to handle file uploads
  const handleFileChange = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you might want to add validation for file type/size
      setImageFunction(file);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  const submitRegistration = () => {
    setIsSubmitting(true);
    
    // Mock API call - in real implementation, this would submit to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 2000);
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
  };

  return (
    <div className="join-pageant-container">
      <div className="page-header mb-4">
        <h2 className="u-text-dark mb-1">Join a Pageant</h2>
        <p className="u-text-dark">Register for a pageant by entering the pageant ID</p>
      </div>

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
                            <strong>Organized by:</strong> {pageantDetails.organization}
                          </p>
                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p className="mb-1"><strong>Dates:</strong> {formatDate(pageantDetails.startDate)} - {formatDate(pageantDetails.endDate)}</p>
                              <p className="mb-1"><strong>Location:</strong> {pageantDetails.location}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1"><strong>Registration Deadline:</strong> {formatDate(pageantDetails.registrationDeadline)}</p>
                              <p className="mb-1"><strong>Entry Fee:</strong> {pageantDetails.entryFee}</p>
                            </div>
                          </div>
                          <p className="mb-1"><strong>Categories:</strong> {pageantDetails.categories.join(", ")}</p>
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
          
          {/* Rest of the steps remain the same */}
          {/* Step 2: Verify Contestant Information */}
          {currentStep === 2 && pageantDetails && (
            <div className="step-content">
              {/* Content for Step 2 */}
              {/* ... (Same as before) ... */}
            </div>
          )}
          
          {/* Step 3: Upload Photos */}
          {currentStep === 3 && pageantDetails && (
            <div className="step-content">
              {/* Content for Step 3 */}
              {/* ... (Same as before) ... */}
            </div>
          )}
          
          {/* Step 4: Sign Waivers */}
          {currentStep === 4 && pageantDetails && (
            <div className="step-content">
              {/* Content for Step 4 */}
              {/* ... (Same as before) ... */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JoinPageant;
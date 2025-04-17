// client/src/pages/dashboard/JoinPageant.jsx
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
        <h2 className="u-text-dark">Join a Pageant</h2>
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
          {/* Step indicators */}
          <div className="steps-indicator mb-4">
            <div className="d-flex justify-content-between">
              <div className={`join-step-item ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="join-step-circle">1</div>
                <div className="join-step-label">Find Pageant</div>
              </div>
              <div className="join-step-line"></div>
              <div className={`join-step-item ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="join-step-circle">2</div>
                <div className="join-step-label">Verify Info</div>
              </div>
              <div className="join-step-line"></div>
              <div className={`join-step-item ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="join-step-circle">3</div>
                <div className="join-step-label">Upload Photos</div>
              </div>
              <div className="join-step-line"></div>
              <div className={`join-step-item ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="join-step-circle">4</div>
                <div className="join-step-label">Sign Waivers</div>
              </div>
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
          
          {/* Step 2: Verify Contestant Information */}
          {currentStep === 2 && pageantDetails && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Verify Your Information</h4>
                  
                  <p className="text-muted mb-4">
                    Please review your profile information below. This information will be shared with the pageant organizers.
                    If anything is incorrect, please update your profile before continuing.
                  </p>
                  
                  <div className="alert alert-info mb-4" role="alert">
                    <div className="d-flex">
                      <div className="me-3">
                        <FontAwesomeIcon icon={faIdCard} size="2x" />
                      </div>
                      <div>
                        <h5 className="alert-heading">Profile Verification</h5>
                        <p className="mb-0">
                          Your profile information must be complete and accurate before registering for pageants. 
                          If needed, <a href="/contestant-dashboard/profile" className="alert-link">update your profile</a> first.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-info">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h5>Personal Information</h5>
                        <div className="mb-3">
                          <p className="mb-1"><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                          <p className="mb-1"><strong>Username:</strong> {user?.username}</p>
                          <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
                          <p className="mb-1"><strong>Age Group:</strong> {user?.ageGroup}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h5>Additional Information</h5>
                        <div className="mb-3">
                          <p className="mb-1"><strong>Hair Color:</strong> Brown</p>
                          <p className="mb-1"><strong>Eye Color:</strong> Blue</p>
                          <p className="mb-1"><strong>Emergency Contact:</strong> Jane Doe (Mother) - (555) 123-4567</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alert alert-warning" role="alert">
                      <strong>Important:</strong> By continuing, you confirm that the information above is accurate.
                    </div>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <button 
                        className="btn btn-secondary"
                        onClick={prevStep}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Continue <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Upload Photos */}
          {currentStep === 3 && pageantDetails && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Upload Photos</h4>
                  
                  <p className="text-muted mb-4">
                    Please upload the required photos for this pageant. These photos will be used by the judges and for promotional materials.
                  </p>
                  
                  <div className="row mb-4">
                    <div className="col-md-6 mb-4 mb-md-0">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Face Shot</h5>
                          <p className="card-text text-muted">
                            Upload a clear, professional headshot. This should be a recent photo focused on your face and shoulders.
                          </p>
                          
                          <div className="upload-area p-3 text-center mb-3" style={{ border: '2px dashed #ccc', borderRadius: '5px' }}>
                            {faceImage ? (
                              <div className="image-preview">
                                <div className="mb-2 text-success">
                                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                  File selected: {faceImage.name}
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setFaceImage(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faImage} size="3x" className="text-muted mb-3" />
                                <p className="mb-3">Drag a file here or click to browse</p>
                                <input
                                  type="file"
                                  id="facePhoto"
                                  className="d-none"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setFaceImage)}
                                />
                                <label htmlFor="facePhoto" className="btn btn-outline-primary">
                                  Select File
                                </label>
                              </>
                            )}
                          </div>
                          
                          <div className="requirements small text-muted">
                            <p className="mb-1">Requirements:</p>
                            <ul className="ps-3">
                              <li>JPEG or PNG format</li>
                              <li>Maximum file size: 5MB</li>
                              <li>Minimum resolution: 1200 x 1500 pixels</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Full Body Shot</h5>
                          <p className="card-text text-muted">
                            Upload a full-length photo showing your entire body. This should be taken against a plain background.
                          </p>
                          
                          <div className="upload-area p-3 text-center mb-3" style={{ border: '2px dashed #ccc', borderRadius: '5px' }}>
                            {fullBodyImage ? (
                              <div className="image-preview">
                                <div className="mb-2 text-success">
                                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                  File selected: {fullBodyImage.name}
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setFullBodyImage(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faImage} size="3x" className="text-muted mb-3" />
                                <p className="mb-3">Drag a file here or click to browse</p>
                                <input
                                  type="file"
                                  id="fullBodyPhoto"
                                  className="d-none"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setFullBodyImage)}
                                />
                                <label htmlFor="fullBodyPhoto" className="btn btn-outline-primary">
                                  Select File
                                </label>
                              </>
                            )}
                          </div>
                          
                          <div className="requirements small text-muted">
                            <p className="mb-1">Requirements:</p>
                            <ul className="ps-3">
                              <li>JPEG or PNG format</li>
                              <li>Maximum file size: 5MB</li>
                              <li>Minimum resolution: 1200 x 1800 pixels</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(!faceImage || !fullBodyImage) && (
                    <div className="alert alert-warning" role="alert">
                      <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                      Both photos are required to continue.
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
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
          {currentStep === 4 && pageantDetails && (
            <div className="step-content">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Sign Waivers & Agreements</h4>
                  
                  <p className="text-muted mb-4">
                    Please review and agree to the following waivers and consent forms required for participation in this pageant.
                  </p>
                  
                  <div className="waiver-container mb-4">
                    <div className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Pageant Participation Waiver</h5>
                        <a href="#" className="btn btn-sm btn-outline-secondary" target="_blank">View Full Document</a>
                      </div>
                      <div className="card-body bg-light" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        <p>
                          This Participant Waiver and Release of Liability (the "Waiver") is entered into between the Participant 
                          (or the Participant's parent or legal guardian if the Participant is under 18 years of age) and 
                          {pageantDetails.organization}, the organizer of {pageantDetails.name} (the "Pageant").
                        </p>
                        
                        <p>
                          <strong>1. Assumption of Risk.</strong> Participant understands and acknowledges that participation 
                          in the Pageant involves certain risks, including but not limited to physical injury, emotional distress, 
                          or property damage. Participant voluntarily assumes all risks associated with participation in the Pageant.
                        </p>
                        
                        <p>
                          <strong>2. Release of Liability.</strong> Participant hereby releases, waives, and discharges the Pageant 
                          organizers, sponsors, venue owners, and their respective officers, directors, employees, volunteers, 
                          agents, and representatives from any and all liability, claims, demands, actions, and causes of action 
                          whatsoever, arising out of or related to any loss, damage, or injury that may be sustained by Participant 
                          or to any property belonging to Participant while participating in the Pageant.
                        </p>
                        
                        <p>
                          <strong>3. Media Release.</strong> Participant grants permission to the Pageant organizers to take 
                          photographs, video recordings, and audio recordings of Participant during the Pageant and to use such 
                          media for promotional, commercial, and educational purposes without compensation or further permission.
                        </p>
                        
                        {/* Additional waiver text would go here */}
                      </div>
                    </div>
                    
                    <div className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Media & Photo Release Form</h5>
                        <a href="#" className="btn btn-sm btn-outline-secondary" target="_blank">View Full Document</a>
                      </div>
                      <div className="card-body bg-light" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        <p>
                          By participating in {pageantDetails.name}, I grant to {pageantDetails.organization}, its representatives 
                          and employees the right to take photographs and videos of me and my property in connection with the 
                          above-identified pageant. I authorize {pageantDetails.organization}, its assigns and transferees to 
                          copyright, use and publish the same in print and/or electronically.
                        </p>
                        
                        <p>
                          I agree that {pageantDetails.organization} may use such photographs of me with or without my name and 
                          for any lawful purpose, including for example such purposes as publicity, illustration, advertising, 
                          and web content.
                        </p>
                        
                        <p>
                          I understand that these images may appear in printed materials, social media, websites, and other 
                          promotional materials related to the pageant. I waive any right to royalties or other compensation 
                          arising or related to the use of the photographs or videos.
                        </p>
                        
                        {/* Additional release text would go here */}
                      </div>
                    </div>
                    
                    <div className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Code of Conduct Agreement</h5>
                        <a href="#" className="btn btn-sm btn-outline-secondary" target="_blank">View Full Document</a>
                      </div>
                      <div className="card-body bg-light" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        <p>
                          As a participant in {pageantDetails.name}, I agree to conduct myself in a manner that reflects positively 
                          on myself, the pageant, and {pageantDetails.organization}.
                        </p>
                        
                        <p>
                          <strong>I agree to:</strong>
                        </p>
                        <ul>
                          <li>Treat all participants, judges, organizers, and staff with respect and courtesy</li>
                          <li>Follow all rules and guidelines set forth by the pageant organizers</li>
                          <li>Represent myself honestly and accurately throughout the pageant process</li>
                          <li>Accept judges' decisions with grace and good sportsmanship</li>
                          <li>Refrain from using offensive language or engaging in inappropriate behavior</li>
                          <li>Avoid any conduct that would bring disrepute to the pageant or its participants</li>
                        </ul>
                        
                        <p>
                          I understand that violation of this Code of Conduct may result in disqualification from the pageant 
                          without refund of entry fees.
                        </p>
                        
                        {/* Additional code of conduct text would go here */}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-check mb-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="agreementCheck"
                      checked={hasAgreedToTerms}
                      onChange={() => setHasAgreedToTerms(!hasAgreedToTerms)}
                    />
                    <label className="form-check-label" htmlFor="agreementCheck">
                      I have read and agree to all the above waivers, releases, and agreements. I understand that checking this box constitutes a legal signature.
                    </label>
                  </div>
                  
                  <div className="fee-summary card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">Fee Summary</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Base Entry Fee:</span>
                        <span>{pageantDetails.entryFee}</span>
                      </div>
                      {pageantDetails.additionalFees.map((fee, index) => (
                        <div className="d-flex justify-content-between mb-2" key={index}>
                          <span>{fee.name}:</span>
                          <span>{fee.amount}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>$130.00</span>
                      </div>
                      <div className="small text-muted mt-2">
                        Payment will be collected after your registration is approved by the pageant organizers.
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
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
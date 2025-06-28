// client/src/components/dashboard/joinPageant/Step4SignWaivers.jsx
import { useEffect} from 'react';
import CheckoutButton from '../CheckoutButton';

const Step4SignWaivers = ({ 
  hasAgreedToTerms, 
  setHasAgreedToTerms, 
  pageantDetails, 
  selectedCategories, 
  errorMessage, 
  isSubmitting, 
  onPrevStep, 
  profileData,
  onSubmitRegistration 
}) => {
  const baseEntryFee = pageantDetails?.entryFee?.amount || 0;
  const categoryFee = selectedCategories?.length * 5 || 0;
  const totalAmount = baseEntryFee + categoryFee;
    useEffect(() => {
        console.log("profileData", profileData);
        console.log('pageantDetails', pageantDetails);
        console.log("selectedCategories", selectedCategories);
    })
    
  return (
    <div className="step-content">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="card-title mb-4">Sign Waivers & Review</h4>
          
          <p className="text-muted mb-4">
            Please read and agree to the terms and conditions below to complete your registration.
          </p>
          
          {/* Terms and Conditions */}
          <div className="terms-section mb-4">
            <h5 className="mb-3">Terms and Conditions</h5>
            <div className="terms-content">
              <div className="card">
                <div className="card-body" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  <h6>Pageant Registration Agreement</h6>
                  <p>
                    By registering for this pageant, you acknowledge and agree to the following terms and conditions:
                  </p>
                  <p>
                    <strong>1. Eligibility:</strong> You confirm that you meet all eligibility requirements for this pageant, 
                    including age, residency, and any other specific criteria outlined by the pageant organization.
                  </p>
                  <p>
                    <strong>2. Conduct:</strong> You agree to maintain the highest standards of conduct and sportsmanship 
                    throughout the competition. Any behavior deemed inappropriate by the pageant organizers may result in 
                    disqualification without refund.
                  </p>
                  <p>
                    <strong>3. Media Release:</strong> You grant permission for your photos, videos, and likeness to be used 
                    for promotional purposes by the pageant organization, including but not limited to social media, websites, 
                    and marketing materials.
                  </p>
                  <p>
                    <strong>4. Entry Fees:</strong> All entry fees are non-refundable once payment is processed. This includes 
                    the base entry fee and any additional category fees.
                  </p>
                  <p>
                    <strong>5. Competition Rules:</strong> You agree to abide by all competition rules and regulations as 
                    outlined by the pageant organization. Failure to comply may result in disqualification.
                  </p>
                  <p>
                    <strong>6. Health and Safety:</strong> You confirm that you are in good health and able to participate 
                    in all aspects of the competition. You participate at your own risk and release the pageant organization 
                    from any liability for injuries or damages.
                  </p>
                  <p>
                    <strong>7. Intellectual Property:</strong> You retain ownership of any original content you create for 
                    the competition, but grant the pageant organization a non-exclusive license to use such content for 
                    pageant-related purposes.
                  </p>
                  <p>
                    <strong>8. Privacy:</strong> Your personal information will be handled in accordance with our privacy 
                    policy and will not be shared with third parties except as necessary for competition administration.
                  </p>
                  <p>
                    By checking the agreement box below, you acknowledge that you have read, understood, and agree to be 
                    bound by these terms and conditions.
                  </p>
                </div>
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
                <strong>Order Summary</strong>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Base Entry Fee:</span>
                  <span className="fw-bold">${baseEntryFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span>Category Fee</span>
                    <small className="d-block text-muted">
                      ({selectedCategories?.length || 0} {(selectedCategories?.length || 0) === 1 ? 'category' : 'categories'} × $5.00)
                    </small>
                  </div>
                  <span className="fw-bold">${categoryFee.toFixed(2)}</span>
                </div>
                <hr className="my-3" />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">Subtotal:</span>
                  <span className="fw-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center text-success mb-3">
                  <span>Processing Fee:</span>
                  <span>$0.00</span>
                </div>
                <hr className="my-3" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold fs-5">${totalAmount.toFixed(2)}</span>
                </div>
                <p className="small text-muted mt-3 mb-0">Payment will be refunded if your registration is declined.</p>
              </div>
            </div>
          </div>

          {/* Selected Categories Display */}
          <div className="selected-categories mb-4">
            <h5 className="mb-3">Selected Categories</h5>
            <div className="categories-list">
              {selectedCategories && selectedCategories.length > 0 ? (
                selectedCategories.map((category, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2">
                    {category}
                  </span>
                ))
              ) : (
                <p className="text-muted">No categories selected</p>
              )}
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
              onClick={onPrevStep}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <path d="m12 19-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <CheckoutButton
                amount={totalAmount.toFixed(2)}
                categories={selectedCategories}
                pageantName={pageantDetails.name}
                organizationName={pageantDetails.organization.name}
                pageantStartDate={pageantDetails.startDate}
                pageantEndDate={pageantDetails.endDate}
                locationCity={pageantDetails.location.address.city}
                locationState={pageantDetails.location.address.state}
                contestantId={profileData.contestant.profile._id}
                pageantId={pageantDetails._id}
                userId={profileData.contestant.user._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4SignWaivers;
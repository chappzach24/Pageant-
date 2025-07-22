// client/src/pages/dashboard/JoinPageantError.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faArrowLeft, 
  faRefresh,
  faCreditCard,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import '../../css/joinPageantError.css';

const JoinPageantError = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const location = useLocation();
  const [errorData, setErrorData] = useState({ 
    errorDate: new Date().toISOString(),
    errorMessage: 'Payment could not be processed'
  });
  const [savingStatus, setSavingStatus] = useState('processing');
  const [savingError, setSavingError] = useState('');
  const [transactionId, setTransactionId] = useState()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const saveErrorPayment = async () => {
    try{
        const formData = new FormData();
        formData.append('pageantId', errorData.pageantId);
        formData.append('categories', JSON.stringify(errorData.selectedCategories));
        formData.append('stripeSessionId', sessionId);
        formData.append('transactionId', transactionId);
        formData.append('stripePaymentIntentId', transactionId);
        formData.append('paymentStatus', 'failed');
        formData.append('paymentAmount', errorData.amount/100);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-checkout-session/fail`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save failed payment');
        }

        setSavingStatus('success');
        return;
    }catch(err){
        console.error("Save to database error:", err);
        setSavingStatus('error');
        setSavingError(err.message);
    }
    
  }

  useEffect(() => {
    const fetchErrorData = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-checkout-session/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
        });

        if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get checkout data');
        }

        const data = await response.json();
        
        setErrorData(prev => ({
        ...prev,
        ...data.metadata,
        selectedCategories: JSON.parse(data.metadata.selectedCategories || '[]'),
        pageantName: data.metadata.pageantName || 'Unknown Pageant'
        }));

        setTransactionId(data.payment_intent.id)
      } catch (error) {
        console.error("Error getting checkout data", error);
        setErrorData(prev => ({
          ...prev,
          errorMessage: 'Unable to retrieve payment details'
        }));
      }
    };

    if (sessionId) {
        fetchErrorData();
    }
  }, [sessionId]);

  useEffect(() => {
    if(errorData.pageantId && errorData.userId){
        saveErrorPayment();
    }
  })

  // Show loading state while processing
  if (savingStatus === 'processing') {
    return (
      <div className="error-page-container">
        <div className="error-header text-center mb-5">
          <div className="error-icon-container mx-auto mb-4">
            <div className="spinner-border text-warning" role="status" style={{width: '4rem', height: '4rem'}}>
              <span className="visually-hidden">Processing payment details...</span>
            </div>
          </div>
          <h1 className="error-title mb-3 text-warning">Processing Payment Details</h1>
          <p className="error-subtitle">
            We're saving your payment information and preparing your error details.
            This should only take a moment...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if saving failed
  if (savingStatus === 'error') {
    return (
      <div className="error-page-container">
        <div className="error-header text-center mb-5">
          <div className="error-icon-container mx-auto mb-4 bg-danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon text-white" />
          </div>
          <h1 className="error-title mb-3 text-danger">System Error</h1>
          <p className="error-subtitle">
            Your payment was not processed, but we encountered an issue saving the error details.
          </p>
          
          {savingError && (
            <div className="alert alert-danger mt-4">
              <strong>Error:</strong> {savingError}
            </div>
          )}
          
          <div className="mt-4">
            <Link 
              to="/contestant-dashboard/join-pageant" 
              className="btn btn-primary me-3"
            >
              <FontAwesomeIcon icon={faRefresh} className="me-2" />
              Try Again
            </Link>
            <Link 
              to="/support" 
              className="btn btn-outline-secondary"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="error-page-container">
      {/* Error Header */}
      <div className="error-header text-center mb-5">
        <div className="error-icon-container mx-auto mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
        </div>
        <h1 className="error-title mb-3">Payment Failed</h1>
        <p className="error-subtitle">
          We're sorry, but your payment could not be processed at this time. 
          You are not currently registered for the pageant.
        </p>
      </div>

      {/* Error Details Card */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card error-details-card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                Payment Error Details
              </h4>
            </div>
            <div className="card-body">
              <div className="error-detail">
                <span className="error-label">Error Date & Time:</span>
                <p className="error-value">{formatDate(errorData.errorDate)}</p>
              </div>
              
              <div className="error-detail">
                <span className="error-label">Error Message:</span>
                <p className="error-value">{errorData.errorMessage}</p>
              </div>
              
              {errorData.pageantName && (
                <div className="error-detail">
                  <span className="error-label">Pageant:</span>
                  <p className="error-value">{errorData.pageantName}</p>
                </div>
              )}

              {sessionId && (
                <div className="error-detail">
                  <span className="error-label">Session ID:</span>
                  <p className="error-value">{sessionId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What Happened Card */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card what-happened-card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                What Happened?
              </h4>
            </div>
            <div className="card-body">
              <p className="mb-3 u-text-dark">
                Your payment could not be processed, which means:
              </p>
              <ul className="error-explanation-list">
                <li>You have <strong>not</strong> been charged for the pageant registration</li>
                <li>You are <strong>not</strong> currently registered for the pageant</li>
                <li>Your spot in the pageant has <strong>not</strong> been reserved</li>
                <li>No confirmation email has been sent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card next-steps-card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Next Steps
              </h4>
            </div>
            <div className="card-body">
              <div className="next-steps-content">
                <div className="next-step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h6 className='mb-1'>Check Your Payment Method</h6>
                    <p>Verify that your card details are correct and that you have sufficient funds available.</p>
                  </div>
                </div>
                
                <div className="next-step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h6 className='mb-1'>Try Again Later</h6>
                    <p>Sometimes payment processing is temporarily unavailable. Please try again in a few minutes.</p>
                  </div>
                </div>
                
                <div className="next-step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h6 className='mb-1'>Contact Support</h6>
                    <p>If the problem persists, please contact our support team for assistance with your registration.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col-12">
          <div className="action-buttons text-center">
            <Link 
              to="/contestant-dashboard/join-pageant" 
              className="btn btn-primary btn-lg me-3 mb-3"
            >
              <FontAwesomeIcon icon={faRefresh} className="me-2" />
              Try Again
            </Link>
            
            <Link 
              to="/contestant-dashboard" 
              className="btn btn-outline-secondary btn-lg mb-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Return to Dashboard
            </Link>
          </div>
          
          <div className="additional-info text-center mt-4">
            <p className="text-muted">
              Need help? Visit our <Link to="/support" className="text-decoration-underline">Support Center</Link> or 
              contact us directly for assistance with your pageant registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPageantError;
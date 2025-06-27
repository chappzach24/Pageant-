// client/src/pages/dashboard/JoinPageantSuccess.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faTrophy, 
  faCalendarAlt, 
  faLocationDot,
  faUsers,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import '../../css/joinPageantSuccess.css';

const JoinPageantSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const location = useLocation();
  const [transactionData, setTransactionData] = useState({ paymentDate: new Date().toISOString() });
  const [transactionId, setTransactionId] = useState();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };


  useEffect(() => {
    const fetchData = async() => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-checkout-session/${sessionId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if(!response.ok){
                const error = await response.json();
                throw new Error(error.error || 'Failed to get checkout data');
            }

            const data = await response.json();

            setTransactionData(prev => ({
            ...prev,
            ...data.metadata,
            selectedCategories: JSON.parse(data.metadata.selectedCategories || '[]'),
            }));

            setTransactionId(data.payment_intent.id)

            console.log("transaction id", data)
        }catch(error){
            console.error("Error getting checkout data", error);
        }
        
    }
    if (sessionId) {
        fetchData();
    }
  }, [sessionId]);

  return (
    <div className="success-page-container">
      {/* Success Header */}
      <div className="success-header text-center mb-5">
        <div className="success-icon-container mx-auto mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
        </div>
        <h1 className="success-title mb-3">Payment Successful!</h1>
        <p className="success-subtitle">
          Congratulations! Your pageant registration has been completed and your payment has been processed.
        </p>
      </div>

      {/* Payment Confirmation */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card payment-confirmation-card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />
                Payment Confirmation
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="payment-detail">
                    <label className="payment-label">Payment ID</label>
                    <p className="payment-value">{transactionId}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="payment-detail">
                    <label className="payment-label">Amount Paid</label>
                    <p className="payment-value text-success fw-bold">{formatCurrency(transactionData?.amount/100)}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="payment-detail">
                    <label className="payment-label">Payment Date</label>
                    <p className="payment-value">{formatDate(transactionData?.paymentDate)}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="payment-detail">
                    <label className="payment-label">Categories Registered</label>
                    <div className="categories-list">
                      {transactionData?.selectedCategories?.map((category, index) => (
                        <span key={index} className="category-badge">{category}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pageant Summary */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card pageant-summary-card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning" />
                Pageant Summary
              </h5>
            </div>
            <div className="card-body">
              <h4 className="pageant-name mb-3">{transactionData?.pageantName}</h4>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="info-item mb-3">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faUsers} className="me-2" />
                      Organization
                    </div>
                    <div className="info-value">{transactionData?.organizationName || 'N/A'}</div>
                  </div>
                  
                  <div className="info-item mb-3">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      Event Dates
                    </div>
                    <div className="info-value">
                      {formatDate(transactionData?.pageantStartDate)} - {formatDate(transactionData?.pageantEndDate)}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="info-item mb-3">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                      Location
                    </div>
                    <div className="info-value">{transactionData?.locationCity || 'TBD'}, {transactionData?.locationState || "TBD"}</div>
                  </div>
                  
                  <div className="info-item mb-3">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faTrophy} className="me-2" />
                      Your Categories
                    </div>
                    <div className="categories-grid">
                      {transactionData?.selectedCategories?.map((category, index) => (
                        <span key={index} className="category-badge primary">{category}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card next-steps-card">
            <div className="card-body">
              <h5 className="card-title mb-4">What's Next?</h5>
              <div className="next-steps-list">
                <div className="next-step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h6>Check Your Email</h6>
                    <p>You'll receive a confirmation email with your registration details and important updates.</p>
                  </div>
                </div>
                
                <div className="next-step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h6>Prepare for the Competition</h6>
                    <p>Start preparing your outfits, practicing your talent, and getting ready for the big day!</p>
                  </div>
                </div>
                
                <div className="next-step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h6>Monitor Your Dashboard</h6>
                    <p>Keep track of updates, schedules, and important announcements in your pageant dashboard.</p>
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
              to="/contestant-dashboard/my-pageants" 
              className="btn btn-primary btn-lg me-3 mb-3"
            >
              <FontAwesomeIcon icon={faTrophy} className="me-2" />
              View My Pageants
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
            
            <Link 
              to="/contestant-dashboard" 
              className="btn btn-outline-secondary btn-lg mb-3"
            >
              Return to Dashboard
            </Link>
          </div>
          
          <div className="additional-info text-center mt-4">
            <p className="text-muted">
              For detailed information about this pageant, schedules, and updates, 
              visit <Link to="/contestant-dashboard/my-pageants" className="text-decoration-underline">My Pageants</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPageantSuccess;
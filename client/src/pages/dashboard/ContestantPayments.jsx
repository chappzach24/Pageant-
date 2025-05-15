// client/src/pages/dashboard/ContestantPayments.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, 
  faCreditCard, 
  faReceipt, 
  faExclamationTriangle, 
  faFilter,
  faSearch,
  faFileDownload,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationCircle,
  faChartPie,
  faDollarSign,
  faPlus,
  faPrint,
  faEnvelope,
  faEllipsisV,
  faEye,
  faLock,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import '../../css/contestantPayments.css';

const ContestantPayments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptModal, setReceiptModal] = useState(false);
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  const [participations, setParticipations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch actual participant data from API
    const fetchParticipantData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/participants`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your registrations');
        }

        const data = await response.json();
        
        if (data.success && data.participants) {
          console.log('API returned participant data:', data.participants);
          setParticipations(data.participants);
        } else {
          throw new Error('Failed to get participation data from server');
        }
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError('Failed to load your registration data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchParticipantData();
    }
  }, [user]);

  // Get pending payments
  const getPendingPayments = () => {
    return participations.filter(p => p.paymentStatus === 'pending');
  };

  // Get completed payments
  const getCompletedPayments = () => {
    return participations.filter(p => p.paymentStatus === 'completed');
  };

  // Get filtered payments based on active tab and search/filter
  const getFilteredPayments = () => {
    let filtered = [];
    
    // First filter by tab
    if (activeTab === 'pending') {
      filtered = getPendingPayments();
    } else if (activeTab === 'history') {
      filtered = getCompletedPayments();
    } else {
      filtered = [...participations];
    }
    
    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.pageant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof p.pageant?.organization === 'string' && p.pageant.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof p.pageant?.organization === 'object' && p.pageant.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  // Calculate total spent
  const calculateTotalSpent = () => {
    return participations
      .filter(p => p.paymentStatus === 'completed')
      .reduce((total, p) => total + p.paymentAmount, 0);
  };

  // Calculate total pending
  const calculateTotalPending = () => {
    return participations
      .filter(p => p.paymentStatus === 'pending')
      .reduce((total, p) => total + p.paymentAmount, 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining until registration deadline
  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return 0;
    
    const today = new Date();
    const deadline = new Date(deadlineDate);
    
    // Calculate difference in days
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Open payment modal
  const openMakePaymentModal = (participation) => {
    setSelectedPayment(participation);
    setMakePaymentModal(true);
  };

  // Close payment modal
  const closeMakePaymentModal = () => {
    setSelectedPayment(null);
    setMakePaymentModal(false);
  };

  // Process payment
  const processPayment = async (paymentMethod) => {
    if (!selectedPayment) return;
    
    // Here you would normally send a request to your payment API
    // For this example, we'll simulate a successful payment
    
    try {
      // Simulate API call
      setIsLoading(true);
      
      // In a real implementation, you would call your payment API
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/process`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify({
      //     participationId: selectedPayment._id,
      //     paymentMethod: paymentMethod,
      //     amount: selectedPayment.paymentAmount
      //   })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the local state to reflect payment completion
      setParticipations(prev => prev.map(p => {
        if (p._id === selectedPayment._id) {
          return {
            ...p,
            paymentStatus: 'completed',
            paymentHistory: [
              ...(p.paymentHistory || []),
              {
                amount: p.paymentAmount,
                date: new Date(),
                transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
                method: paymentMethod
              }
            ]
          };
        }
        return p;
      }));
      
      // Show success message
      alert('Payment processed successfully!');
      
      // Close the modal
      setMakePaymentModal(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get payment status icon and class
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { icon: faCheckCircle, className: 'status-paid', text: 'Paid' };
      case 'pending':
        return { icon: faClock, className: 'status-pending', text: 'Pending' };
      case 'partial':
        return { icon: faExclamationCircle, className: 'status-pending', text: 'Partial' };
      default:
        return { icon: faExclamationCircle, className: 'status-unknown', text: 'Unknown' };
    }
  };

  return (
    <div className="payments-container">
      <div className="page-header mb-4">
        <div>
          <h2 className="u-text-dark mb-1">Payments</h2>
          <p className="u-text-dark">Manage your pageant payments and finances</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="financial-summary card mb-4">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="summary-item">
                <div className="summary-icon">
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{formatCurrency(calculateTotalSpent())}</div>
                  <div className="summary-label">Total Spent</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div className="summary-icon warning">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">
                    {formatCurrency(calculateTotalPending())}
                  </div>
                  <div className="summary-label">Pending Payments</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div className="summary-icon purple">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">
                    {getPendingPayments().length}
                  </div>
                  <div className="summary-label">Pending Registrations</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div className="summary-icon blue">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{participations.length}</div>
                  <div className="summary-label">Total Registrations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Pending Payments
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FontAwesomeIcon icon={faReceipt} className="me-2" />
            Payment History
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'methods' ? 'active' : ''}`}
            onClick={() => setActiveTab('methods')}
          >
            <FontAwesomeIcon icon={faCreditCard} className="me-2" />
            Payment Methods
          </button>
        </li>
      </ul>

      {/* Pending Payments Tab */}
      {activeTab === 'pending' && (
        <div className="tab-content">
          {/* Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search pending payments by pageant name or organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Payments Cards */}
          {isLoading ? (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : getFilteredPayments().length === 0 ? (
            <div className="alert alert-info text-center" role="alert">
              <FontAwesomeIcon icon={faCheckCircle} size="3x" className="d-block mx-auto mb-3 text-success" />
              <h4>No Pending Payments</h4>
              <p>Great news! You don't have any pending payments at this time.</p>
            </div>
          ) : (
            <div className="row g-4">
              {getFilteredPayments().map((participation, index) => (
                <div className="col-md-6" key={participation._id || index}>
                  <div className={`card upcoming-payment-card ${getDaysRemaining(participation.pageant.registrationDeadline) <= 7 ? 'urgent' : ''}`}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">{participation.pageant.name}</h5>
                      {getDaysRemaining(participation.pageant.registrationDeadline) <= 7 && (
                        <span className="badge bg-danger">
                          <FontAwesomeIcon icon={faExclamationCircle} className="me-1" />
                          Due Soon
                        </span>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="pageant-info mb-3">
                        <div className="info-label">Organization</div>
                        <div className="info-value">
                          {typeof participation.pageant.organization === 'string' 
                            ? participation.pageant.organization 
                            : participation.pageant.organization?.name || 'Unknown Organization'}
                        </div>
                      </div>
                      
                      <div className="date-info mb-3">
                        <div className="info-label">Registration Deadline</div>
                        <div className="info-value">{formatDate(participation.pageant.registrationDeadline)}</div>
                        <div className={`days-counter ${getDaysRemaining(participation.pageant.registrationDeadline) <= 7 ? 'text-danger' : ''}`}>
                          {getDaysRemaining(participation.pageant.registrationDeadline) > 0 
                            ? `${getDaysRemaining(participation.pageant.registrationDeadline)} ${getDaysRemaining(participation.pageant.registrationDeadline) === 1 ? 'day' : 'days'} remaining` 
                            : 'Due today'}
                        </div>
                      </div>
                      
                      <div className="payment-details mb-3">
                        <div className="info-label">Payment Details</div>
                        <div className="info-value amount">{formatCurrency(participation.paymentAmount)}</div>
                        <div className="categories-list">
                          {participation.categories.map((category, idx) => (
                            <span key={idx} className="category-badge">
                              {typeof category === 'string' ? category : category.category}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <button 
                          className="btn btn-primary w-100"
                          onClick={() => openMakePaymentModal(participation)}
                        >
                          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                          Make Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="tab-content">
          {/* Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search payment history by pageant name or organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="card">
            <div className="card-body p-0">
              {isLoading ? (
                <div className="p-5 text-center">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : getFilteredPayments().length === 0 ? (
                <div className="p-5 text-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mb-3 text-warning" size="2x" />
                  <p className="mb-0 u-text-dark">No payment history found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table payment-table mb-0">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Pageant</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredPayments().map((participation) => {
                        const statusInfo = getPaymentStatusInfo(participation.paymentStatus);
                        // Get the most recent payment from history
                        const latestPayment = participation.paymentHistory?.length > 0 
                          ? participation.paymentHistory[participation.paymentHistory.length - 1] 
                          : null;
                        
                        return (
                          <tr key={participation._id}>
                            <td>
                              <span className={`status-badge ${statusInfo.className}`}>
                                <FontAwesomeIcon icon={statusInfo.icon} className="me-1" />
                                {statusInfo.text}
                              </span>
                            </td>
                            <td>
                              <div className="pageant-info">
                                <div className="pageant-name">{participation.pageant.name}</div>
                                <div className="pageant-org">
                                  {typeof participation.pageant.organization === 'string' 
                                    ? participation.pageant.organization 
                                    : participation.pageant.organization?.name || 'Unknown Organization'}
                                </div>
                              </div>
                            </td>
                            <td>
                              {participation.paymentStatus === 'completed' ? (
                                <div className="date-info">
                                  <div>Paid on: {formatDate(latestPayment?.date)}</div>
                                </div>
                              ) : (
                                <div className="date-info">
                                  <div>Due: {formatDate(participation.pageant.registrationDeadline)}</div>
                                  <div className={`days-remaining ${getDaysRemaining(participation.pageant.registrationDeadline) <= 7 ? 'text-danger' : ''}`}>
                                    {getDaysRemaining(participation.pageant.registrationDeadline) > 0 
                                      ? `${getDaysRemaining(participation.pageant.registrationDeadline)} days remaining` 
                                      : 'Due today'}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="amount">{formatCurrency(participation.paymentAmount)}</div>
                              <div className="categories-count">
                                {participation.categories.length} {participation.categories.length === 1 ? 'category' : 'categories'}
                              </div>
                            </td>
                            <td>
                              {latestPayment?.method || (
                                participation.paymentStatus === 'completed' ? 'Not recorded' : '—'
                              )}
                            </td>
                            <td>
                              <div className="actions-dropdown dropdown">
                                <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                <ul className="dropdown-menu">
                                  {participation.paymentStatus === 'completed' && (
                                    <>
                                      <li>
                                        <button className="dropdown-item">
                                          <FontAwesomeIcon icon={faReceipt} className="me-2" />
                                          View Receipt
                                        </button>
                                      </li>
                                      <li>
                                        <button className="dropdown-item">
                                          <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                          Download PDF
                                        </button>
                                      </li>
                                      <li>
                                        <button className="dropdown-item">
                                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                          Email Receipt
                                        </button>
                                      </li>
                                    </>
                                  )}
                                  {participation.paymentStatus === 'pending' && (
                                    <li>
                                      <button 
                                        className="dropdown-item"
                                        onClick={() => openMakePaymentModal(participation)}
                                      >
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                                        Make Payment
                                      </button>
                                    </li>
                                  )}
                                  <li>
                                    <button className="dropdown-item">
                                      <FontAwesomeIcon icon={faEye} className="me-2" />
                                      View Details
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="tab-content">
          <div className="row">
            <div className="col-md-8">
              {/* Payment Methods List */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Saved Payment Methods</h5>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setPaymentMethodModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    Add New
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="p-4 text-center">
                    <FontAwesomeIcon icon={faCreditCard} size="3x" className="mb-3 text-secondary" />
                    <p className="mb-3">No payment methods saved yet.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setPaymentMethodModal(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              {/* Payment Security Info */}
              <div className="card card-info">
                <div className="card-body">
                  <h5 className="card-title">Payment Security</h5>
                  <p className='u-text-dark'>Your payment information is encrypted and securely stored. We never store your complete card details on our servers.</p>
                  <p className='u-text-dark'>When you add a new payment method, you're creating a secure token that can only be used for pageant-related transactions.</p>
                  <div className="security-badges mt-3 text-center">
                    <FontAwesomeIcon icon={faLock} size="2x" className="text-secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make Payment Modal */}
      {makePaymentModal && selectedPayment && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Make Payment</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={closeMakePaymentModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="payment-details mb-4">
                  <h5>Payment Summary</h5>
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-6">
                          <strong>Pageant:</strong>
                        </div>
                        <div className="col-6">
                          {selectedPayment.pageant.name}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6">
                          <strong>Organization:</strong>
                        </div>
                        <div className="col-6">
                          {typeof selectedPayment.pageant.organization === 'string' 
                            ? selectedPayment.pageant.organization 
                            : selectedPayment.pageant.organization?.name || 'Unknown Organization'}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6">
                          <strong>Registration Deadline:</strong>
                        </div>
                        <div className="col-6">
                          {formatDate(selectedPayment.pageant.registrationDeadline)}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6">
                          <strong>Categories:</strong>
                        </div>
                        <div className="col-6">
                          {selectedPayment.categories.map((category, idx) => (
                            <span key={idx} className="d-block">
                              {typeof category === 'string' ? category : category.category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <strong>Total Amount:</strong>
                        </div>
                        <div className="col-6 fw-bold">
                          {formatCurrency(selectedPayment.paymentAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment-methods mb-4">
                  <h5>Choose Payment Method</h5>
                  <div className="list-group">
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => processPayment('Credit Card')}
                    >
                      <div className="me-3">
                        <FontAwesomeIcon icon={faCreditCard} size="lg" />
                      </div>
                      <div>
                        <h6 className="mb-0">Credit Card</h6>
                        <small className="text-muted">Pay with Visa, MasterCard, or American Express</small>
                      </div>
                    </button>
                    <button 
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => processPayment('PayPal')}
                    >
                      <div className="me-3">
                        <i className="fab fa-paypal"></i>
                        <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
                      </div>
                      <div>
                        <h6 className="mb-0">PayPal</h6>
                        <small className="text-muted">Pay with your PayPal account</small>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  This is a simulated payment process. In a real implementation, you would be redirected to a secure payment gateway.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeMakePaymentModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestantPayments;
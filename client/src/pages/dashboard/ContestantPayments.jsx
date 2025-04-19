// client/src/pages/dashboard/Payments.jsx
import { useState, useEffect } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import '../../css/contestantPayments.css';

const ContestantPayments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptModal, setReceiptModal] = useState(false);

  // Mock data for frontend development
  const mockPayments = [
    {
      id: 'pay-1',
      pageantId: 'p1',
      pageantName: 'Spring Classic Pageant',
      organization: 'Golden Crown Productions',
      amount: 125.00,
      date: '2024-03-10',
      dueDate: '2024-03-15',
      status: 'paid',
      method: 'Visa ending in 4242',
      transactionId: 'txn_1234567890',
      categories: ['Registration Fee', 'Evening Gown', 'Talent'],
      receiptUrl: '#'
    },
    {
      id: 'pay-2',
      pageantId: 'p2',
      pageantName: 'Winter Wonderland Pageant',
      organization: 'Northern Lights Productions',
      amount: 95.00,
      date: '2023-12-01',
      dueDate: '2023-12-05',
      status: 'paid',
      method: 'MasterCard ending in 5555',
      transactionId: 'txn_0987654321',
      categories: ['Registration Fee', 'Winter Theme Costume'],
      receiptUrl: '#'
    },
    {
      id: 'pay-3',
      pageantId: 'p3',
      pageantName: 'National Junior Superstar',
      organization: 'Starlight Events',
      amount: 175.00,
      date: null,
      dueDate: '2025-05-20',
      status: 'upcoming',
      method: null,
      transactionId: null,
      categories: ['Registration Fee', 'Talent Showcase', 'Interview', 'Evening Wear'],
      receiptUrl: null
    },
    {
      id: 'pay-4',
      pageantId: 'p4',
      pageantName: 'Summer Elegance 2025',
      organization: 'Coastal Pageants Inc.',
      amount: 150.00,
      date: null,
      dueDate: '2025-04-30',
      status: 'pending',
      method: null,
      transactionId: null,
      categories: ['Registration Fee', 'Swimwear', 'Evening Gown'],
      receiptUrl: null
    }
  ];

  const mockPaymentMethods = [
    {
      id: 'pm-1',
      type: 'credit',
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    },
    {
      id: 'pm-2',
      type: 'credit',
      brand: 'MasterCard',
      last4: '5555',
      expMonth: 4,
      expYear: 2026,
      isDefault: false
    }
  ];

  useEffect(() => {
    // Simulated API call to fetch payment data
    const fetchPayments = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchPayments();
  }, []);

  // Calculate total spent
  const calculateTotalSpent = () => {
    return mockPayments
      .filter(payment => payment.status === 'paid')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  // Get filtered payments
  const getFilteredPayments = () => {
    let filtered = [...mockPayments];
    
    // Filter by status
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.pageantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Get urgent payments
  const getUrgentPayments = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    return mockPayments.filter(payment => {
      if (payment.status === 'paid') return false;
      
      const dueDate = new Date(payment.dueDate);
      return dueDate <= twoWeeksFromNow;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
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

  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    // Calculate difference in days
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Handle payment method change
  const handleSetDefaultPaymentMethod = (id) => {
    const updatedMethods = mockPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    // In a real implementation, you would update this via API
    console.log('Setting default payment method:', id);
  };

  // Open receipt modal
  const openReceiptModal = (payment) => {
    setSelectedPayment(payment);
    setReceiptModal(true);
  };

  // Get payment status icon and class
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return { icon: faCheckCircle, className: 'status-paid', text: 'Paid' };
      case 'pending':
        return { icon: faClock, className: 'status-pending', text: 'Pending' };
      case 'upcoming':
        return { icon: faCalendarAlt, className: 'status-upcoming', text: 'Upcoming' };
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
                    {formatCurrency(
                      mockPayments
                        .filter(p => p.status === 'pending')
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
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
                    {formatCurrency(
                      mockPayments
                        .filter(p => p.status === 'upcoming')
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </div>
                  <div className="summary-label">Upcoming Payments</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div className="summary-icon blue">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{mockPayments.length}</div>
                  <div className="summary-label">Total Transactions</div>
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
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FontAwesomeIcon icon={faReceipt} className="me-2" />
            Payment History
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Upcoming Payments
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

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="tab-content">
          {/* Search and Filter */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search payments by pageant name or organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faFilter} />
                    </span>
                    <select
                      className="form-select"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
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
                  <p className="mb-0">No payments found matching your criteria.</p>
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
                      {getFilteredPayments().map(payment => {
                        const statusInfo = getPaymentStatusInfo(payment.status);
                        
                        return (
                          <tr key={payment.id}>
                            <td>
                              <span className={`status-badge ${statusInfo.className}`}>
                                <FontAwesomeIcon icon={statusInfo.icon} className="me-1" />
                                {statusInfo.text}
                              </span>
                            </td>
                            <td>
                              <div className="pageant-info">
                                <div className="pageant-name">{payment.pageantName}</div>
                                <div className="pageant-org">{payment.organization}</div>
                              </div>
                            </td>
                            <td>
                              {payment.status === 'paid' ? (
                                <div className="date-info">
                                  <div>Paid on: {formatDate(payment.date)}</div>
                                </div>
                              ) : (
                                <div className="date-info">
                                  <div>Due: {formatDate(payment.dueDate)}</div>
                                  <div className={`days-remaining ${getDaysRemaining(payment.dueDate) <= 7 ? 'text-danger' : ''}`}>
                                    {getDaysRemaining(payment.dueDate) > 0 
                                      ? `${getDaysRemaining(payment.dueDate)} days remaining` 
                                      : 'Due today'}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="amount">{formatCurrency(payment.amount)}</div>
                              <div className="categories-count">
                                {payment.categories.length} {payment.categories.length === 1 ? 'category' : 'categories'}
                              </div>
                            </td>
                            <td>
                              {payment.method || (
                                payment.status === 'paid' ? 'Not recorded' : '—'
                              )}
                            </td>
                            <td>
                              <div className="actions-dropdown dropdown">
                                <button className="btn btn-sm dropdown-toggle" type="button" id={`actions-${payment.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                <ul className="dropdown-menu" aria-labelledby={`actions-${payment.id}`}>
                                  {payment.status === 'paid' && (
                                    <>
                                      <li>
                                        <button 
                                          className="dropdown-item" 
                                          onClick={() => openReceiptModal(payment)}
                                        >
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
                                      <li>
                                        <button className="dropdown-item">
                                          <FontAwesomeIcon icon={faPrint} className="me-2" />
                                          Print Receipt
                                        </button>
                                      </li>
                                    </>
                                  )}
                                  {(payment.status === 'pending' || payment.status === 'upcoming') && (
                                    <li>
                                      <button className="dropdown-item">
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

      {/* Upcoming Payments Tab */}
      {activeTab === 'upcoming' && (
        <div className="tab-content">
          {/* Urgent Payments */}
          {getUrgentPayments().length > 0 && (
            <div className="alert alert-warning mb-4">
              <h5 className="alert-heading">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                Attention: Payments Due Soon
              </h5>
              <p>You have {getUrgentPayments().length} {getUrgentPayments().length === 1 ? 'payment' : 'payments'} due within the next two weeks.</p>
            </div>
          )}

          {/* Upcoming Payment Cards */}
          <div className="row g-4">
            {mockPayments
              .filter(payment => payment.status === 'upcoming' || payment.status === 'pending')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(payment => {
                const daysRemaining = getDaysRemaining(payment.dueDate);
                const isUrgent = daysRemaining <= 7;
                
                return (
                  <div className="col-md-6 col-lg-4" key={payment.id}>
                    <div className={`card upcoming-payment-card h-100 ${isUrgent ? 'urgent' : ''}`}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">{payment.pageantName}</h5>
                        {isUrgent && (
                          <span className="badge bg-danger">
                            <FontAwesomeIcon icon={faExclamationCircle} className="me-1" />
                            Due Soon
                          </span>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column">
                        <div className="pageant-info mb-3">
                          <div className="info-label">Organization</div>
                          <div className="info-value">{payment.organization}</div>
                        </div>
                        
                        <div className="date-info mb-3">
                          <div className="info-label">Due Date</div>
                          <div className="info-value">{formatDate(payment.dueDate)}</div>
                          <div className={`days-counter ${isUrgent ? 'text-danger' : ''}`}>
                            {daysRemaining > 0 
                              ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining` 
                              : 'Due today'}
                          </div>
                        </div>
                        
                        <div className="payment-details mb-3">
                          <div className="info-label">Payment Details</div>
                          <div className="info-value amount">{formatCurrency(payment.amount)}</div>
                          <div className="categories-list">
                            {payment.categories.map((category, idx) => (
                              <span key={idx} className="category-badge">{category}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <button className="btn btn-primary w-100">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                            Make Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {mockPayments.filter(payment => payment.status === 'upcoming' || payment.status === 'pending').length === 0 && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" size="lg" />
                  You have no upcoming payments due. All caught up!
                </div>
              </div>
            )}
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
                  {mockPaymentMethods.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="mb-0">No payment methods saved yet.</p>
                    </div>
                  ) : (
                    <ul className="list-group payment-methods-list">
                      {mockPaymentMethods.map(method => (
                        <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="payment-method-info">
                            <div className="method-icon me-3">
                              {method.brand === 'Visa' ? (
                                <span className="visa-icon">Visa</span>
                              ) : method.brand === 'MasterCard' ? (
                                <span className="mastercard-icon">MC</span>
                              ) : (
                                <FontAwesomeIcon icon={faCreditCard} />
                              )}
                            </div>
                            <div className="method-details">
                              <div className="method-name">
                                {method.brand} **** {method.last4}
                                {method.isDefault && <span className="default-badge ms-2">Default</span>}
                              </div>
                              <div className="method-expiry">
                                Expires {method.expMonth}/{method.expYear}
                              </div>
                            </div>
                          </div>
                          <div className="payment-method-actions">
                            {!method.isDefault && (
                              <button 
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Set Default
                              </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger">
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              {/* Payment Security Info */}
              <div className="card card-info">
                <div className="card-body">
                  <h5 className="card-title">Payment Security</h5>
                  <p>Your payment information is encrypted and securely stored. We never store your complete card details on our servers.</p>
                  <p>When you add a new payment method, you're creating a secure token that can only be used for pageant-related transactions.</p>
                  <div className="security-badges mt-3">
                    <div className="security-badge">
                      <img src="/placeholder-ssl-badge.png" alt="SSL Secured" width="80" />
                    </div>
                    <div className="security-badge">
                      <img src="/placeholder-pci-badge.png" alt="PCI Compliant" width="80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {receiptModal && selectedPayment && (
        <div className="modal receipt-modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment Receipt</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setReceiptModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="receipt-container">
                  <div className="receipt-header text-center mb-4">
                    <h4>Payment Confirmation</h4>
                    <p className="mb-1">
                      Transaction ID: {selectedPayment.transactionId}
                    </p>
                    <p className="mb-0">
                      {formatDate(selectedPayment.date)}
                    </p>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="receipt-section">
                        <h6 className="receipt-section-title">Pageant Details</h6>
                        <div className="receipt-detail">
                          <div className="detail-label">Pageant Name:</div>
                          <div className="detail-value">{selectedPayment.pageantName}</div>
                        </div>
                        <div className="receipt-detail">
                          <div className="detail-label">Organization:</div>
                          <div className="detail-value">{selectedPayment.organization}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="receipt-section">
                        <h6 className="receipt-section-title">Payment Information</h6>
                        <div className="receipt-detail">
                          <div className="detail-label">Amount Paid:</div>
                          <div className="detail-value">{formatCurrency(selectedPayment.amount)}</div>
                        </div>
                        <div className="receipt-detail">
                          <div className="detail-label">Payment Method:</div>
                          <div className="detail-value">{selectedPayment.method}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="receipt-section mb-4">
                    <h6 className="receipt-section-title">Categories</h6>
                    <ul className="categories-list">
                      {selectedPayment.categories.map((category, idx) => (
                        <li key={idx}>{category}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="receipt-total">
                    <div className="receipt-detail total">
                      <div className="detail-label">Total Amount:</div>
                      <div className="detail-value">{formatCurrency(selectedPayment.amount)}</div>
                    </div>
                  </div>
                  
                  <div className="receipt-footer text-center mt-4">
                    <p className="mb-1">Thank you for your payment.</p>
                    <p className="mb-0 text-muted">This is an official receipt for your records.</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setReceiptModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                  Download PDF
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <FontAwesomeIcon icon={faPrint} className="me-2" />
                  Print Receipt
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
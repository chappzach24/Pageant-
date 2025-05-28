// client/src/pages/dashboard/ContestantPayments.jsx - REFACTORED VERSION
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, 
  faCreditCard, 
  faReceipt,
  faCheckCircle,
  faInfoCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  TabNavigation, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert 
} from '../../components/dashboard/common';

// Import specialized components
import { 
  PaymentSummaryCard, 
  PendingPaymentCard, 
  PaymentHistoryTable 
} from '../../components/dashboard/contestant';

// Import custom hooks and utilities
import { usePageantData } from '../../hooks/usePageantData';
import { usePaymentData } from '../../hooks/usePaymentData';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils';

import '../../css/contestantPayments.css';

const ContestantPayments = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Use custom hooks
  const { participations, loading, error } = usePageantData();
  const { 
    totalSpent, 
    totalPending, 
    pendingCount, 
    totalRegistrations,
    getPendingPayments, 
    getCompletedPayments 
  } = usePaymentData(participations);

  // Tab configuration
  const tabs = [
    {
      id: 'pending',
      label: 'Pending Payments',
      icon: faMoneyBillWave,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      id: 'history',
      label: 'Payment History',
      icon: faReceipt
    },
    {
      id: 'methods',
      label: 'Payment Methods',
      icon: faCreditCard
    }
  ];

  // Get filtered payments based on active tab and search
  const getFilteredPayments = () => {
    let filtered = [];
    
    if (activeTab === 'pending') {
      filtered = getPendingPayments();
    } else if (activeTab === 'history') {
      filtered = getCompletedPayments();
    } else {
      filtered = [...participations];
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.pageant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof p.pageant?.organization === 'string' && p.pageant.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof p.pageant?.organization === 'object' && p.pageant.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  // Payment handlers
  const openMakePaymentModal = (participation) => {
    setSelectedPayment(participation);
    setMakePaymentModal(true);
  };

  const closeMakePaymentModal = () => {
    setSelectedPayment(null);
    setMakePaymentModal(false);
  };

  const processPayment = async (paymentMethod) => {
    if (!selectedPayment) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the local state to reflect payment completion
      // This would normally be handled by refetching data or updating state
      alert('Payment processed successfully!');
      closeMakePaymentModal();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const filteredPayments = getFilteredPayments();

  return (
    <div className="payments-container">
      <DashboardPageHeader 
        title="Payments"
        subtitle="Manage your pageant payments and finances"
      />

      {/* Payment Summary */}
      <PaymentSummaryCard 
        totalSpent={totalSpent}
        totalPending={totalPending}
        pendingCount={pendingCount}
        totalRegistrations={totalRegistrations}
        formatCurrency={formatCurrency}
      />

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner text="Loading payment information..." />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <div className="tab-content">
          {/* Pending Payments Tab */}
          {activeTab === 'pending' && (
            <>
              {/* Search */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon="faSearch" />
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

              {filteredPayments.length === 0 ? (
                <EmptyState 
                  icon={faCheckCircle}
                  title="No Pending Payments"
                  message="Great news! You don't have any pending payments at this time."
                  variant="success"
                />
              ) : (
                <div className="row g-4">
                  {filteredPayments.map((participation, index) => (
                    <div className="col-md-6" key={participation._id || index}>
                      <PendingPaymentCard 
                        participation={participation}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getDaysRemaining={getDaysRemaining}
                        onMakePayment={openMakePaymentModal}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <>
              {/* Search */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon="faSearch" />
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

              <div className="card">
                <div className="card-body p-0">
                  {filteredPayments.length === 0 ? (
                    <EmptyState 
                      message="No payment history found."
                      variant="info"
                      className="p-5"
                    />
                  ) : (
                    <PaymentHistoryTable 
                      payments={filteredPayments}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      getDaysRemaining={getDaysRemaining}
                      onMakePayment={openMakePaymentModal}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="row">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Saved Payment Methods</h5>
                    <button className="btn btn-sm btn-outline-primary">
                      <FontAwesomeIcon icon={faPlus} className="me-1" />
                      Add New
                    </button>
                  </div>
                  <div className="card-body">
                    <EmptyState 
                      icon={faCreditCard}
                      message="No payment methods saved yet."
                      actionButton={
                        <button className="btn btn-primary">
                          <FontAwesomeIcon icon={faPlus} className="me-2" />
                          Add Payment Method
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card card-info">
                  <div className="card-body">
                    <h5 className="card-title">Payment Security</h5>
                    <p className='u-text-dark'>
                      Your payment information is encrypted and securely stored. 
                      We never store your complete card details on our servers.
                    </p>
                    <p className='u-text-dark'>
                      When you add a new payment method, you're creating a secure token 
                      that can only be used for pageant-related transactions.
                    </p>
                    <div className="security-badges mt-3 text-center">
                      <FontAwesomeIcon icon="faLock" size="2x" className="text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
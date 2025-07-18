// client/src/pages/dashboard/ContestantPayments.jsx - REDESIGNED VERSION
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReceipt,
  faSearch,
  faFileDownload,
  faEnvelope,
  faEye,
  faCalendarAlt,
  faFilter,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert 
} from '../../components/dashboard/common';

// Import specialized components
import { PaymentSummaryCard } from '../../components/dashboard/contestant';

// Import custom hooks and utilities
import { usePageantData } from '../../hooks/usePageantData';
import { usePaymentData } from '../../hooks/usePaymentData';
import { formatCurrency, formatDate } from '../../utils';

import '../../css/contestantPayments.css';

const ContestantPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, this-month, last-3-months, this-year
  const [showFilters, setShowFilters] = useState(false);

  // Use custom hooks
  const { participations, loading, error } = usePageantData();
  const { 
    totalSpent, 
    totalRegistrations,
    getCompletedPayments 
  } = usePaymentData(participations);

  // Get all completed payments (payment history)
  const completedPayments = getCompletedPayments();

  // Filter payments based on search and date filters
  const getFilteredPayments = () => {
    let filtered = [...completedPayments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.pageant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof p.pageant?.organization === 'string' && 
         p.pageant.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof p.pageant?.organization === 'object' && 
         p.pageant.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'this-month':
          filterDate.setMonth(now.getMonth(), 1);
          break;
        case 'last-3-months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'this-year':
          filterDate.setFullYear(now.getFullYear(), 0, 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(p => {
        const paymentDate = p.paymentHistory?.length > 0 
          ? new Date(p.paymentHistory[p.paymentHistory.length - 1].date)
          : new Date(p.registrationDate);
        return paymentDate >= filterDate;
      });
    }

    // Sort by payment date (most recent first)
    filtered.sort((a, b) => {
      const aDate = a.paymentHistory?.length > 0 
        ? new Date(a.paymentHistory[a.paymentHistory.length - 1].date)
        : new Date(a.registrationDate);
      const bDate = b.paymentHistory?.length > 0 
        ? new Date(b.paymentHistory[b.paymentHistory.length - 1].date)
        : new Date(b.registrationDate);
      return bDate - aDate;
    });

    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Calculate additional stats for the updated summary
  const currentYear = new Date().getFullYear();
  const thisYearPayments = completedPayments.filter(p => {
    const paymentDate = p.paymentHistory?.length > 0 
      ? new Date(p.paymentHistory[p.paymentHistory.length - 1].date)
      : new Date(p.registrationDate);
    return paymentDate.getFullYear() === currentYear;
  });
  
  const totalSpentThisYear = thisYearPayments.reduce((total, p) => total + p.paymentAmount, 0);
  const averagePaymentAmount = completedPayments.length > 0 
    ? totalSpent / completedPayments.length 
    : 0;

  // Download receipt function
  const downloadReceipt = (participation) => {
    // Simulate receipt download
    console.log('Downloading receipt for:', participation.pageant.name);
    alert('Receipt download started! (This is a demo - in real implementation, this would generate a PDF)');
  };

  // Email receipt function
  const emailReceipt = (participation) => {
    // Simulate email receipt
    console.log('Emailing receipt for:', participation.pageant.name);
    alert('Receipt sent to your email! (This is a demo)');
  };

  // View payment details function
  const viewPaymentDetails = (participation) => {
    // This would open a modal or navigate to a detailed view
    console.log('Viewing details for:', participation.pageant.name);
    alert('Payment details view (This would open a detailed modal in real implementation)');
  };

  return (
    <div className="payments-container">
      <DashboardPageHeader 
        title="Payment History"
        subtitle="View your pageant registration payments and download receipts"
        action={
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        }
      />

      {/* Enhanced Payment Summary */}
      <div className="financial-summary card mb-4">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="summary-item">
                <div 
                  className="summary-icon"
                  style={{
                    backgroundColor: 'var(--brand-color)1A',
                    color: 'var(--brand-color)'
                  }}
                >
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{formatCurrency(totalSpent)}</div>
                  <div className="summary-label">Total Spent (All Time)</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div 
                  className="summary-icon"
                  style={{
                    backgroundColor: '#1976D21A',
                    color: '#1976D2'
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{formatCurrency(totalSpentThisYear)}</div>
                  <div className="summary-label">Spent This Year</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div 
                  className="summary-icon"
                  style={{
                    backgroundColor: '#7B1FA21A',
                    color: '#7B1FA2'
                  }}
                >
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{totalRegistrations}</div>
                  <div className="summary-label">Total Registrations</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="summary-item">
                <div 
                  className="summary-icon"
                  style={{
                    backgroundColor: '#00796B1A',
                    color: '#00796B'
                  }}
                >
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{formatCurrency(averagePaymentAmount)}</div>
                  <div className="summary-label">Average Payment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
                  placeholder="Search by pageant name or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>
            
            {showFilters && (
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="this-month">This Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            )}
          </div>
          
          {(searchTerm || dateFilter !== 'all') && (
            <div className="mt-3">
              <small className="text-muted">
                Showing {filteredPayments.length} of {completedPayments.length} payments
                {searchTerm && ` matching "${searchTerm}"`}
                {dateFilter !== 'all' && ` from ${dateFilter.replace('-', ' ')}`}
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payment History</h5>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                // Simulate bulk export
                alert('Exporting all payment receipts... (Demo)');
              }}
            >
              <FontAwesomeIcon icon={faFileDownload} className="me-1" />
              Export All
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading payment history..." />
          ) : error ? (
            <ErrorAlert message={error} />
          ) : filteredPayments.length === 0 ? (
            <EmptyState 
              icon={faReceipt}
              title={searchTerm || dateFilter !== 'all' ? "No Payments Found" : "No Payment History"}
              message={
                searchTerm || dateFilter !== 'all' 
                  ? "No payments match your current search criteria."
                  : "You haven't made any pageant registration payments yet."
              }
              className="p-5"
              variant="info"
              colorClass='u-text-dark'
            />
          ) : (
            <div className="table-responsive">
              <table className="table payment-table mb-0">
                <thead>
                  <tr>
                    <th>Pageant Details</th>
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Categories</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((participation) => {
                    const latestPayment = participation.paymentHistory?.length > 0 
                      ? participation.paymentHistory[participation.paymentHistory.length - 1] 
                      : null;
                    
                    return (
                      <tr key={participation._id}>
                        <td>
                          <div className="pageant-info">
                            <div className="pageant-name">{participation.pageant.name}</div>
                            <div className="pageant-org">
                              {typeof participation.pageant.organization === 'string' 
                                ? participation.pageant.organization 
                                : participation.pageant.organization?.name || 'Unknown Organization'}
                            </div>
                            <div className="pageant-date">
                              {formatDate(participation.pageant.startDate)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="payment-date-info">
                            <div className="main-date">
                              {formatDate(latestPayment?.date || participation.registrationDate)}
                            </div>
                            <div className="time-ago text-muted">
                              {/* You could add a "time ago" helper here */}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="amount">{formatCurrency(participation.paymentAmount)}</div>
                          <div className="payment-status">
                            <span className="status-badge status-paid">
                              <FontAwesomeIcon icon={faReceipt} className="me-1" />
                              Paid
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="categories-info">
                            <div className="categories-count">
                              {participation.categories.length} {participation.categories.length === 1 ? 'category' : 'categories'}
                            </div>
                            <div className="categories-list">
                              {participation.categories.slice(0, 2).map((category, index) => (
                                <span key={index} className="category-tag">
                                  {typeof category === 'string' ? category : category.category}
                                </span>
                              ))}
                              {participation.categories.length > 2 && (
                                <span className="category-tag">
                                  +{participation.categories.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="payment-method">
                            {latestPayment?.method || 'Card Payment'}
                          </div>
                          {latestPayment?.transactionId && (
                            <div className="transaction-id">
                              ID: {latestPayment.transactionId.slice(-8)}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons" style={{ marginTop: '0'}}>
                            <button 
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => viewPaymentDetails(participation)}
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success me-1"
                              onClick={() => downloadReceipt(participation)}
                              title="Download Receipt"
                            >
                              <FontAwesomeIcon icon={faFileDownload} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => emailReceipt(participation)}
                              title="Email Receipt"
                            >
                              <FontAwesomeIcon icon={faEnvelope} />
                            </button>
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
  );
};

export default ContestantPayments;
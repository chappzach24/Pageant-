import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faClock, 
  faExclamationCircle,
  faEllipsisV,
  faReceipt,
  faFileDownload,
  faEnvelope,
  faMoneyBillWave,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PaymentHistoryTable = ({ 
  payments, 
  formatCurrency, 
  formatDate, 
  getDaysRemaining, 
  onMakePayment 
}) => {
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
          {payments.map((participation) => {
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
                            onClick={() => onMakePayment(participation)}
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
  );
};

PaymentHistoryTable.propTypes = {
  payments: PropTypes.array.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getDaysRemaining: PropTypes.func.isRequired,
  onMakePayment: PropTypes.func.isRequired
};

export default PaymentHistoryTable;
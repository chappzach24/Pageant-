import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, 
  faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PendingPaymentCard = ({ 
  participation, 
  formatCurrency, 
  formatDate, 
  getDaysRemaining, 
  onMakePayment 
}) => {
  const daysRemaining = getDaysRemaining(participation.pageant.registrationDeadline);
  const isUrgent = daysRemaining <= 7;

  return (
    <div className={`card upcoming-payment-card ${isUrgent ? 'urgent' : ''}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{participation.pageant.name}</h5>
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
          <div className="info-value">
            {typeof participation.pageant.organization === 'string' 
              ? participation.pageant.organization 
              : participation.pageant.organization?.name || 'Unknown Organization'}
          </div>
        </div>
        
        <div className="date-info mb-3">
          <div className="info-label">Registration Deadline</div>
          <div className="info-value">{formatDate(participation.pageant.registrationDeadline)}</div>
          <div className={`days-counter ${isUrgent ? 'text-danger' : ''}`}>
            {daysRemaining > 0 
              ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining` 
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
            onClick={() => onMakePayment(participation)}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

PendingPaymentCard.propTypes = {
  participation: PropTypes.object.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getDaysRemaining: PropTypes.func.isRequired,
  onMakePayment: PropTypes.func.isRequired
};

export default PendingPaymentCard;
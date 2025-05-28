import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faClock, 
  faCalendarAlt, 
  faChartPie 
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PaymentSummaryCard = ({ 
  totalSpent, 
  totalPending, 
  pendingCount, 
  totalRegistrations,
  formatCurrency 
}) => {
  const summaryItems = [
    {
      icon: faDollarSign,
      value: formatCurrency(totalSpent),
      label: 'Total Spent',
      iconColor: 'var(--brand-color)'
    },
    {
      icon: faClock,
      value: formatCurrency(totalPending),
      label: 'Pending Payments',
      iconColor: '#FF8F00'
    },
    {
      icon: faCalendarAlt,
      value: pendingCount,
      label: 'Pending Registrations',
      iconColor: '#7B1FA2'
    },
    {
      icon: faChartPie,
      value: totalRegistrations,
      label: 'Total Registrations',
      iconColor: '#1976D2'
    }
  ];

  return (
    <div className="financial-summary card mb-4">
      <div className="card-body">
        <div className="row g-4">
          {summaryItems.map((item, index) => (
            <div className="col-md-3" key={index}>
              <div className="summary-item">
                <div 
                  className="summary-icon"
                  style={{
                    backgroundColor: `${item.iconColor}1A`,
                    color: item.iconColor
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{item.value}</div>
                  <div className="summary-label">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PaymentSummaryCard.propTypes = {
  totalSpent: PropTypes.number.isRequired,
  totalPending: PropTypes.number.isRequired,
  pendingCount: PropTypes.number.isRequired,
  totalRegistrations: PropTypes.number.isRequired,
  formatCurrency: PropTypes.func.isRequired
};

export default PaymentSummaryCard;
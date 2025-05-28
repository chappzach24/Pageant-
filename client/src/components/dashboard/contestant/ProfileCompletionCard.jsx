import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileCompletionCard = ({ 
  completeness, 
  className = "" 
}) => {
  const getProgressBarClass = () => {
    if (completeness < 50) return 'bg-danger';
    if (completeness < 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusInfo = () => {
    if (completeness >= 100) {
      return {
        icon: faCheck,
        iconClass: 'text-success',
        message: 'Profile is complete! You\'re all set for pageants.'
      };
    } else {
      return {
        icon: faExclamationTriangle,
        iconClass: 'text-warning',
        message: 'Complete your profile to join pageants.'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`card mb-4 ${className}`}>
      <div className="card-body">
        <h5 className="card-title">Profile Completeness</h5>
        <div className="progress mb-3">
          <div 
            className={`progress-bar ${getProgressBarClass()}`}
            role="progressbar" 
            style={{ width: `${completeness}%` }} 
            aria-valuenow={completeness} 
            aria-valuemin="0" 
            aria-valuemax="100"
          >
            {completeness}%
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon 
              icon={statusInfo.icon} 
              className={`${statusInfo.iconClass} me-2`} 
            />
            <small className="text-muted">{statusInfo.message}</small>
          </div>
          {completeness < 100 && (
            <Link 
              to="/contestant-dashboard/profile" 
              className="btn btn-sm btn-outline-primary"
            >
              Complete Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileCompletionCard.propTypes = {
  completeness: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default ProfileCompletionCard;
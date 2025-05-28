import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ErrorAlert = ({ 
  message, 
  title = "Error", 
  className = "",
  dismissible = false,
  onDismiss
}) => {
  return (
    <div className={`alert alert-danger ${dismissible ? 'alert-dismissible' : ''} ${className}`} role="alert">
      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
      {title && <strong>{title}: </strong>}
      {message}
      {dismissible && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onDismiss}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func
};

export default ErrorAlert;

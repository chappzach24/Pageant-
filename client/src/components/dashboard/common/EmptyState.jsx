import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionButton,
  className = "",
  colorClass = "",
  variant = "info" // info, warning, success
}) => {
  const alertClass = `alert-${variant}`;
  
  return (
    <div className={`alert ${alertClass} text-center ${className}`} role="alert">
      {icon && (
        <FontAwesomeIcon 
          icon={icon} 
          size="3x" 
          className="d-block mx-auto mb-3" 
        />
      )}
      {title && <h4>{title}</h4>}
      {message && <p className={`mb-0 ${colorClass}`}>{message}</p>}
      {actionButton && <div className="mt-3">{actionButton}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string,
  message: PropTypes.string,
  actionButton: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['info', 'warning', 'success', 'danger'])
};

export default EmptyState;
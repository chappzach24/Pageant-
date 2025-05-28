import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const ActionButton = ({ 
  variant = "primary", 
  size = "normal", 
  icon, 
  children, 
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const sizeClass = size === "small" ? "btn-sm" : size === "large" ? "btn-lg" : "";
  const buttonClass = `btn btn-${variant} ${sizeClass} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        <>
          {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
          {children}
        </>
      )}
    </button>
  );
};

ActionButton.propTypes = {
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 
    'outline-warning', 'outline-info', 'outline-light', 'outline-dark'
  ]),
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  icon: PropTypes.object,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default ActionButton;
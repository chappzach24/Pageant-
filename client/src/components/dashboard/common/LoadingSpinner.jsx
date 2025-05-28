import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = "normal", 
  color = "secondary", 
  text = "Loading...", 
  className = "" 
}) => {
  const sizeClass = size === "small" ? "spinner-border-sm" : "";
  
  return (
    <div className={`d-flex justify-content-center p-5 ${className}`}>
      <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'normal']),
  color: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string
};

export default LoadingSpinner;
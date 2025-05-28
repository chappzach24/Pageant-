import PropTypes from 'prop-types';

const StepsIndicator = ({ 
  steps, 
  currentStep, 
  className = "" 
}) => {
  return (
    <div className={`steps-indicator mb-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index}>
          <div className={`join-step-item ${currentStep >= step.number ? 'active' : ''}`}>
            <div className="join-step-circle">{step.number}</div>
            <div className="join-step-label">{step.label}</div>
          </div>
          {index < steps.length - 1 && (
            <div className={`join-step-line ${currentStep >= step.number + 1 ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

StepsIndicator.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  currentStep: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default StepsIndicator;
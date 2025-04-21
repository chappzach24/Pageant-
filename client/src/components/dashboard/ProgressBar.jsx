// client/src/components/dashboard/ProgressBar.jsx
import PropTypes from 'prop-types';

const ProgressBar = ({ percentage, height = 8, color = 'var(--brand-color)' }) => {
  return (
    <div 
      className="progress-bar-container" 
      style={{ 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: height, 
        height: `${height}px`,
        overflow: 'hidden'
      }}
    >
      <div 
        className="progress-bar-fill" 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color, 
          height: '100%',
          borderRadius: height,
          transition: 'width 0.3s ease-in-out'
        }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  height: PropTypes.number,
  color: PropTypes.string
};

export default ProgressBar;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const StatCard = ({ 
  icon, 
  value, 
  label, 
  iconColor = "brand-color", 
  className = "",
  size = "normal" // normal, large
}) => {
  const cardSize = size === "large" ? "p-4" : "p-3";
  const iconSize = size === "large" ? "3rem" : "2.5rem";
  const valueSize = size === "large" ? "2rem" : "1.75rem";
  
  return (
    <div className={`card h-100 shadow-sm ${className}`}>
      <div className={`card-body d-flex flex-column align-items-center text-center ${cardSize}`}>
        {icon && (
          <div 
            className="stat-icon mb-3"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: `rgba(212, 175, 55, 0.1)`,
              color: 'var(--brand-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: iconSize
            }}
          >
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <div 
          className="stat-value fw-bold mb-2"
          style={{ 
            fontSize: valueSize,
            color: 'var(--secondary-color)' 
          }}
        >
          {value}
        </div>
        <div 
          className="stat-label text-uppercase"
          style={{ 
            fontSize: '0.875rem',
            color: '#6c757d',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'large'])
};

export default StatCard;
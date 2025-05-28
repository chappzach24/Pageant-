import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "",
  variant = "tabs" // tabs, pills
}) => {
  const navClass = variant === "pills" ? "nav-pills" : "nav-tabs";
  
  return (
    <ul className={`nav ${navClass} mb-4 ${className}`}>
      {tabs.map((tab, index) => (
        <li className="nav-item" key={index}>
          <button 
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.icon && (
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
            )}
            {tab.label}
            {tab.badge && (
              <span className="badge bg-secondary ms-2">{tab.badge}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

TabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.object,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['tabs', 'pills'])
};

export default TabNavigation;
import PropTypes from 'prop-types';

const StatusBadge = ({ 
  status, 
  statusConfig = {}, 
  className = "" 
}) => {
  // Default status configurations
  const defaultConfig = {
    pending: { bg: 'bg-warning', text: 'text-dark', label: 'Pending' },
    completed: { bg: 'bg-success', text: 'text-white', label: 'Completed' },
    active: { bg: 'bg-primary', text: 'text-white', label: 'Active' },
    inactive: { bg: 'bg-secondary', text: 'text-white', label: 'Inactive' },
    cancelled: { bg: 'bg-danger', text: 'text-white', label: 'Cancelled' },
    draft: { bg: 'bg-secondary', text: 'text-white', label: 'Draft' },
    published: { bg: 'bg-success', text: 'text-white', label: 'Published' }
  };
  
  const config = { ...defaultConfig, ...statusConfig };
  const statusInfo = config[status] || { bg: 'bg-secondary', text: 'text-white', label: status };
  
  return (
    <span className={`badge ${statusInfo.bg} ${statusInfo.text} ${className}`}>
      {statusInfo.label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  statusConfig: PropTypes.object,
  className: PropTypes.string
};

export default StatusBadge;
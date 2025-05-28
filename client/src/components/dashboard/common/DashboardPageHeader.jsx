import PropTypes from 'prop-types';

const DashboardPageHeader = ({ 
  title, 
  subtitle, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`page-header mb-4 d-flex justify-content-between align-items-center ${className}`}>
      <div>
        <h2 className="u-text-dark mb-1">{title}</h2>
        {subtitle && <p className="u-text-dark">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

DashboardPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

export default DashboardPageHeader;
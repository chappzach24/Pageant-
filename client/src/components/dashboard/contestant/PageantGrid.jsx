import PageantCard from '../../dashboard/PageantCard';
import PropTypes from 'prop-types';

const PageantGrid = ({ 
  pageants, 
  type = 'active', 
  showCategories = true, 
  showResults = false, 
  renderActions,
  className = "" 
}) => {
  return (
    <div className={`pageants-grid ${className}`}>
      <div className="row g-4">
        {pageants.map((pageant, index) => (
          <div className="col-md-6 col-lg-4" key={pageant._id || index}>
            <PageantCard 
              pageant={pageant} 
              type={type} 
              showCategories={showCategories}
              showResults={showResults}
              className={`delay-${index % 6}`}
              renderActions={renderActions ? () => renderActions(pageant) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

PageantGrid.propTypes = {
  pageants: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['active', 'past']),
  showCategories: PropTypes.bool,
  showResults: PropTypes.bool,
  renderActions: PropTypes.func,
  className: PropTypes.string
};

export default PageantGrid;
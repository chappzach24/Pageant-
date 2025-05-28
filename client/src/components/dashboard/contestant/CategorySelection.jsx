import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const CategorySelection = ({ 
  categories, 
  selectedCategories, 
  onCategoryToggle, 
  className = "" 
}) => {
  return (
    <div className={`category-selection mb-4 ${className}`}>
      <h5 className="mb-3">Select Categories</h5>
      <p className="text-muted mb-3">Please select the categories you would like to compete in:</p>
      
      <div className="categories-list">
        {categories.map((category, index) => {
          const categoryName = typeof category === 'string' ? category : category.name;
          return (
            <div className="form-check mb-2" key={index}>
              <input 
                className="form-check-input" 
                type="checkbox" 
                id={`category-${index}`}
                checked={selectedCategories.includes(categoryName)}
                onChange={() => onCategoryToggle(categoryName)}
              />
              <label className="form-check-label" htmlFor={`category-${index}`}>
                {categoryName}
              </label>
            </div>
          );
        })}
      </div>
      
      {selectedCategories.length === 0 && (
        <div className="alert alert-warning mt-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Please select at least one category to continue.
        </div>
      )}
    </div>
  );
};

CategorySelection.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  onCategoryToggle: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default CategorySelection;

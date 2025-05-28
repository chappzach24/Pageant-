import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const SearchFilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filterOptions = [], 
  sortOptions = [],
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  placeholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`card mb-4 ${className}`}>
      <div className="card-body">
        <div className="row g-3">
          <div className={`col-md-${filterOptions.length > 0 || sortOptions.length > 0 ? '6' : '12'}`}>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          {filterOptions.length > 0 && (
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <select
                  className="form-select"
                  value={selectedFilter}
                  onChange={(e) => onFilterChange(e.target.value)}
                >
                  {filterOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {sortOptions.length > 0 && (
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSort} />
                </span>
                <select
                  className="form-select"
                  value={selectedSort}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  {sortOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SearchFilterBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  sortOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  selectedFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
  selectedSort: PropTypes.string,
  onSortChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default SearchFilterBar;
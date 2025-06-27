// client/src/components/dashboard/joinPageant/Step3UploadPhotos.jsx
import React from 'react';

const Step3UploadPhotos = ({ 
  faceImage, 
  setFaceImage, 
  fullBodyImage, 
  setFullBodyImage, 
  selectedCategories, 
  setSelectedCategories, 
  pageantDetails, 
  onPrevStep, 
  onNextStep 
}) => {
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="step-content">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="card-title mb-4">Upload Photos & Select Categories</h4>
          
          <p className="text-muted mb-4">
            Upload your photos and select the categories you want to compete in. 
            High-quality photos are recommended for the best results.
          </p>
          
          {/* Photo Upload Section */}
          <div className="photo-upload-section mb-5">
            <h5 className="mb-3">Required Photos</h5>
            
            <div className="row g-4">
              {/* Face Image Upload */}
              <div className="col-md-6">
                <div className="upload-area">
                  <label className="form-label fw-bold">Face Image *</label>
                  <div className="photo-upload-container border rounded p-4 text-center">
                    {faceImage ? (
                      <div className="uploaded-photo">
                        <img 
                          src={URL.createObjectURL(faceImage)} 
                          alt="Face" 
                          className="img-fluid rounded mb-3"
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            aspectRatio: '3/4',
                            objectFit: 'cover'
                          }}
                        />
                        <p className="text-success mb-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {faceImage.name}
                        </p>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setFaceImage(null)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-muted mb-3">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        <p className="text-muted mb-3">Upload a clear headshot</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setFaceImage(e.target.files[0])}
                          className="form-control"
                        />
                      </div>
                    )}
                  </div>
                  <small className="text-muted">
                    For best quality, upload in 3:4 portrait ratio (JPG, PNG, max 5MB)
                  </small>
                </div>
              </div>

              {/* Full Body Image Upload */}
              <div className="col-md-6">
                <div className="upload-area">
                  <label className="form-label fw-bold">Full Body Image *</label>
                  <div className="photo-upload-container border rounded p-4 text-center">
                    {fullBodyImage ? (
                      <div className="uploaded-photo">
                        <img 
                          src={URL.createObjectURL(fullBodyImage)} 
                          alt="Full Body" 
                          className="img-fluid rounded mb-3"
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            aspectRatio: '3/4',
                            objectFit: 'cover'
                          }}
                        />
                        <p className="text-success mb-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {fullBodyImage.name}
                        </p>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setFullBodyImage(null)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-muted mb-3">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        <p className="text-muted mb-3">Upload a full body photo</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setFullBodyImage(e.target.files[0])}
                          className="form-control"
                        />
                      </div>
                    )}
                  </div>
                  <small className="text-muted">
                    For best quality, upload in 3:4 portrait ratio (JPG, PNG, max 5MB)
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection Section */}
          <div className="category-selection-section mb-4">
            <h5 className="mb-3">Select Competition Categories</h5>
            <p className="text-muted mb-3">
              Choose the categories you want to compete in. Each additional category costs $5.00.
            </p>
            
            <div className="categories-grid">
              {pageantDetails?.categories?.map((category, index) => {
                const categoryName = typeof category === 'string' ? category : category.name;
                const isSelected = selectedCategories.includes(categoryName);
                
                return (
                  <div key={index} className="category-item mb-3">
                    <div className={`card category-card ${isSelected ? 'selected' : ''}`}>
                      <div className="card-body">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={`category-${index}`}
                            checked={isSelected}
                            onChange={() => handleCategoryChange(categoryName)}
                          />
                          <label className="form-check-label w-100" htmlFor={`category-${index}`}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{categoryName}</strong>
                                <small className="d-block text-muted">
                                  {typeof category === 'object' && category.description ? 
                                    category.description : 
                                    `Compete in ${categoryName} category`
                                  }
                                </small>
                              </div>
                              <span className="badge bg-light text-dark">$5.00</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Categories Summary */}
            {selectedCategories.length > 0 && (
              <div className="selected-summary mt-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="mb-2">Selected Categories ({selectedCategories.length})</h6>
                    <div className="selected-categories mb-2">
                      {selectedCategories.map((category, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-1">
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="fee-calculation">
                      <small className="text-muted">
                        Additional category fees: {selectedCategories.length} × $5.00 = 
                        <strong className="text-success"> ${(selectedCategories.length * 5).toFixed(2)}</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Checklist */}
          <div className="progress-section mb-4">
            <h5 className="mb-3">Progress Checklist</h5>
            <div className="card bg-light">
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className={faceImage ? 'text-success' : 'text-muted'}>
                    {faceImage ? '✓' : '○'} Face image uploaded
                  </li>
                  <li className={fullBodyImage ? 'text-success' : 'text-muted'}>
                    {fullBodyImage ? '✓' : '○'} Full body image uploaded
                  </li>
                  <li className={selectedCategories.length > 0 ? 'text-success' : 'text-muted'}>
                    {selectedCategories.length > 0 ? '✓' : '○'} At least one category selected
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="button-group d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary"
              onClick={onPrevStep}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <path d="m12 19-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={onNextStep}
              disabled={!faceImage || !fullBodyImage || selectedCategories.length === 0}
            >
              Continue 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ms-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .photo-upload-container {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 2px dashed #dee2e6;
          transition: border-color 0.3s ease;
          margin-bottom: 0.5rem;
        }

        .photo-upload-container:hover {
          border-color: #0d6efd;
        }

        .uploaded-photo img {
          width: 100%;
          max-width: 200px;
          aspect-ratio: 3/4;
          object-fit: cover;
          border-radius: 8px;
        }

        .category-card {
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .category-card:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
        }

        .category-card.selected {
          border-color: #0d6efd;
          background-color: #f0f8ff;
        }

        .upload-placeholder input[type="file"] {
          margin-top: 1rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Step3UploadPhotos;
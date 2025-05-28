import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const FileUploadArea = ({ 
  title, 
  uploadedFile, 
  onFileChange, 
  onFileRemove, 
  inputId, 
  acceptedTypes = "image/jpeg, image/png, image/jpg, image/heic",
  className = "" 
}) => {
  return (
    <div className={`upload-container ${className}`}>
      <h5>{title}</h5>
      <div 
        className="upload-area"
        onClick={() => document.getElementById(inputId).click()}
      >
        {uploadedFile ? (
          <div className="image-preview-container">
            {uploadedFile.preview ? (
              <img 
                src={uploadedFile.preview} 
                alt={`${title} preview`} 
                className="preview-image" 
              />
            ) : (
              <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="2x" />
            )}
            <p className="mb-1">Selected: {uploadedFile.name}</p>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-danger remove-button"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="upload-instructions">
            <FontAwesomeIcon icon={faImage} className="mb-3" size="2x" />
            <p>Click to upload or drag and drop</p>
            <p className="small text-muted mb-0">JPG, PNG or HEIC (max 5MB)</p>
          </div>
        )}
      </div>
      <input 
        type="file" 
        id={inputId} 
        hidden 
        accept={acceptedTypes}
        onChange={onFileChange}
      />
    </div>
  );
};

FileUploadArea.propTypes = {
  title: PropTypes.string.isRequired,
  uploadedFile: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  onFileRemove: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  acceptedTypes: PropTypes.string,
  className: PropTypes.string
};

export default FileUploadArea;
// client/src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../components/global/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Remove confirmPassword from data to send to API
    const { confirmPassword, ...registerData } = formData;
    
    try {
      await register(registerData);
      navigate('/organization-dashboard'); // Redirect to dashboard after registration
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrap min-vh-100 d-flex align-items-center justify-content-center u-background-primary py-5">
      <div className="auth-container u-container" style={{ maxWidth: '580px' }}>
        <div className="auth-card p-4 p-md-5 rounded shadow">
          <div className="auth-header text-center mb-4">
            <h2 className="u-text-dark">Create an Account</h2>
            <p className="u-text-dark">Join our platform to manage your pageants</p>
          </div>
          
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="d-flex flex-column u-gap-m">
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-group">
                  <label htmlFor="firstName" className="u-text-dark mb-1">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="lastName" className="u-text-dark mb-1">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="u-text-dark mb-1">Username</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="u-text-dark mb-1">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="u-text-dark mb-1">Date of Birth</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <input
                  type="date"
                  className="form-control"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="u-text-dark mb-1">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="text-muted">Password must be at least 6 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="u-text-dark mb-1">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-dark w-100 py-2 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="text-center mt-3">
              <p className="u-text-dark mb-0">
                Already have an account? <Link to="/login" className="u-text-brand">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
// client/src/components/dashboard/PageantDetailsModal.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faLocationDot,
  faMoneyBillWave,
  faMedal,
  faClipboardList,
  faUser,
  faUsers,
  faBuilding,
  faClock,
  faCircleInfo,
  faFileAlt,
  faDownload,
  faPrint,
  faShare,
  faSearch,
  faUpload,
  faPlus,
  faTimesCircle,
  faCheckCircle,
  faExclamationTriangle,
  faFileSignature,
  faEnvelope,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import '../../css/pageantDetailsModal.css';

const PageantDetailsModal = ({ pageant, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Return null if modal shouldn't be shown or no pageant data
  if (!isOpen || !pageant) return null;

  // Safely get property from potentially null/undefined nested objects
  const getSafe = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) return defaultValue;
      current = current[key];
    }
    
    return current !== null && current !== undefined ? current : defaultValue;
  };

  // Safe render for potentially problematic data
  const SafeRender = ({ value, fallback = '' }) => {
    if (value === null || value === undefined) {
      return <>{fallback}</>;
    }
    
    if (typeof value === 'object') {
      return <>{JSON.stringify(value)}</>;
    }
    
    return <>{value}</>;
  };

  // Create safe getters for the pageant object
  const getName = () => getSafe(pageant, 'name', 'Untitled Pageant');
  const getOrganizationName = () => {
    const org = pageant.organization;
    if (!org) return 'Unknown Organization';
    
    if (typeof org === 'string') return org;
    if (typeof org === 'object' && org.name) return org.name;
    if (typeof org === 'object' && org._id && typeof org._id === 'object' && org._id.name) {
      return org._id.name;
    }
    
    return 'Unknown Organization';
  };

  // Other getter functions for safe access to pageant properties
  const getStartDate = () => getSafe(pageant, 'startDate');
  const getEndDate = () => getSafe(pageant, 'endDate');
  const getVenue = () => getSafe(pageant, 'location.venue', 'Online');
  const getCity = () => getSafe(pageant, 'location.address.city', '');
  const getState = () => getSafe(pageant, 'location.address.state', '');

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get location string
  const getLocationString = (location) => {
    if (!location) return 'Online';
    
    let locationStr = location.venue || '';
    
    if (location.address) {
      if (locationStr) locationStr += ', ';
      
      if (location.address.city) {
        locationStr += location.address.city;
      }
      
      if (location.address.state) {
        if (location.address.city) locationStr += ', ';
        locationStr += location.address.state;
      }
    }
    
    return locationStr || 'Online';
  };

  // Calculate days remaining
  const getDaysRemaining = (startDate) => {
    const today = new Date();
    const pageantDate = new Date(startDate);
    
    // Calculate difference in days
    const diffTime = pageantDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Calculate pageant progress (for in-progress pageants)
  const calculateProgress = () => {
    const today = new Date();
    const startDate = new Date(pageant.startDate);
    const endDate = new Date(pageant.endDate);
    
    // If not started yet
    if (today < startDate) return 0;
    
    // If already ended
    if (today > endDate) return 100;
    
    // Calculate progress percentage
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Get status label
  const getStatusLabel = () => {
    const today = new Date();
    const startDate = new Date(pageant.startDate);
    const endDate = new Date(pageant.endDate);
    
    if (today < startDate) {
      return {
        text: 'Upcoming',
        class: 'bg-primary'
      };
    } else if (today >= startDate && today <= endDate) {
      return {
        text: 'In Progress',
        class: 'bg-success'
      };
    } else {
      return {
        text: 'Completed',
        class: 'bg-secondary'
      };
    }
  };

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    if (!num) return '';
    
    const j = num % 10,
          k = num % 100;
          
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };

  // Get color for placement
  const getPlacementColor = (placement) => {
    if (!placement) return 'text-muted';
    
    switch (placement) {
      case 1: return 'text-gold';
      case 2: return 'text-silver';
      case 3: return 'text-bronze';
      default: return 'text-muted';
    }
  };

  // Pageant status
  const status = getStatusLabel();

  // Get pageant categories
  const categories = Array.isArray(pageant.categories) 
    ? pageant.categories.map(cat => typeof cat === 'string' ? cat : cat.category)
    : [];

  // Mock schedule data (for demonstration)
  const scheduleData = [
    { 
      date: formatDate(pageant.startDate), 
      events: [
        { time: '9:00 AM', name: 'Registration & Check-in', location: 'Main Lobby', forYou: true },
        { time: '11:00 AM', name: 'Orientation', location: 'Grand Ballroom', forYou: true, description: 'All contestants must attend. Rules and guidelines will be reviewed.' },
        { time: '2:00 PM', name: 'Rehearsals', location: 'Stage Area', forYou: true },
        { time: '7:00 PM', name: 'Welcome Reception', location: 'Terrace Hall', forYou: true }
      ]
    },
    { 
      // Create a new date for day 2 and format it properly 
      date: formatDate(new Date(new Date(pageant.startDate).setDate(new Date(pageant.startDate).getDate() + 1))),
      events: [
        { time: '10:00 AM', name: 'Interview Competition', location: 'Conference Rooms', forYou: categories.includes('Interview') || categories.includes('Question and Answer') },
        { time: '2:00 PM', name: 'Talent Competition', location: 'Main Stage', forYou: categories.includes('Talent') || categories.includes('Talent Showcase') },
        { time: '7:00 PM', name: 'Dinner Gala', location: 'Grand Ballroom', forYou: true }
      ]
    },
    { 
      date: formatDate(pageant.endDate), 
      events: [
        { time: '10:00 AM', name: 'Evening Wear Competition', location: 'Main Stage', forYou: categories.includes('Evening Gown') || categories.includes('Formal Wear') },
        { time: '2:00 PM', name: 'Final Judging', location: 'Main Stage', forYou: true },
        { time: '7:00 PM', name: 'Awards Ceremony', location: 'Grand Ballroom', forYou: true }
      ]
    }
  ];

  // Mock documents data (for demonstration)
  const documentsData = [
    { name: 'Contestant Information Packet', type: 'PDF', size: '1.2 MB', date: '2025-01-15' },
    { name: 'Schedule & Itinerary', type: 'PDF', size: '0.5 MB', date: '2025-02-01' },
    { name: 'Pageant Rules & Guidelines', type: 'PDF', size: '0.8 MB', date: '2025-01-15' },
    { name: 'Venue Map', type: 'PDF', size: '0.3 MB', date: '2025-02-10' }
  ];

  // Safe getter for string values, prevents rendering objects directly
  const getStringValue = (value, defaultValue = '') => {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object') {
      // Convert object to string to prevent direct rendering
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.error('Error stringifying object:', e);
        return defaultValue;
      }
    }
    
    // For other types like numbers, booleans
    return String(value);
  };

  return (
    <div className="pageant-details-modal-backdrop" onClick={onClose}>
      <div className="pageant-details-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{pageant.name}</h2>
            <p className="modal-subtitle">{getStringValue(pageant.organization)}</p>
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {/* Status banner */}
        <div className={`status-banner ${status.class}`}>
          <div className="status-content">
            <span className="status-label">{status.text}</span>
            
            {status.text === 'Upcoming' && (
              <span className="status-details">
                {getDaysRemaining(pageant.startDate)} days until pageant
              </span>
            )}
            
            {status.text === 'In Progress' && (
              <div className="status-progress">
                <span className="status-details">Pageant in progress</span>
                <ProgressBar percentage={calculateProgress()} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="tab-icon" />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="tab-icon" />
            Schedule
          </button>
          <button 
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FontAwesomeIcon icon={faClipboardList} className="tab-icon" />
            Categories
          </button>
          {pageant.status === 'completed' && (
            <button 
              className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <FontAwesomeIcon icon={faMedal} className="tab-icon" />
              Results
            </button>
          )}
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FontAwesomeIcon icon={faFileAlt} className="tab-icon" />
            Documents
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content overview-tab">
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className="info-details">
                    <h3>Dates</h3>
                    <p>{formatDate(pageant.startDate)} - {formatDate(pageant.endDate)}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div className="info-details">
                    <h3>Location</h3>
                    <p>{getLocationString(pageant.location)}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div className="info-details">
                    <h3>Organized By</h3>
                    <p>{getStringValue(pageant.organization)}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="info-details">
                    <h3>Age Group</h3>
                    <p>{pageant.ageGroup || 'All Age Groups'}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faClipboardList} />
                  </div>
                  <div className="info-details">
                    <h3>Categories</h3>
                    <p>{categories.length} registered categories</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                  </div>
                  <div className="info-details">
                    <h3>Entry Fee</h3>
                    <p>{pageant.entryFee || formatCurrency(75)}</p>
                  </div>
                </div>
              </div>
              
              <div className="description-section">
                <h3>Pageant Description</h3>
                <p>
                  {pageant.description || 
                  `Join us for the prestigious ${pageant.name}, where contestants showcase their talents and compete for top honors. This event brings together participants from across the region to celebrate beauty, talent, and community spirit.`}
                </p>
              </div>
              
              <div className="action-buttons">
                {status.text === 'Upcoming' && (
                  <button className="primary-button">
                    <FontAwesomeIcon icon={faUser} className="button-icon" />
                    Update Registration
                  </button>
                )}
                {status.text === 'In Progress' && (
                  <button className="primary-button">
                    <FontAwesomeIcon icon={faClock} className="button-icon" />
                    Check Schedule
                  </button>
                )}
                <button className="outline-button">
                  <FontAwesomeIcon icon={faShare} className="button-icon" />
                  Share
                </button>
                <button className="outline-button">
                  <FontAwesomeIcon icon={faPrint} className="button-icon" />
                  Print Details
                </button>
              </div>
            </div>
          )}
          
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="tab-content schedule-tab">
              <h3 className="tab-heading">Pageant Schedule</h3>
              <div className="schedule-timeline">
                {scheduleData.map((day, index) => (
                  <div className="schedule-day" key={index}>
                    <div className="day-header">
                      <h4>{day.date || day.formattedDate}</h4>
                      <span className="day-label">Day {index + 1}</span>
                    </div>
                    <div className="day-events">
                      {day.events.map((event, eventIndex) => (
                        <div className="event-card" key={eventIndex}>
                          <div className="event-time">{event.time}</div>
                          <div className="event-details">
                            <h5 className="event-name">{event.name}</h5>
                            <p className="event-location">{event.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="schedule-notes">
                <h4>Important Notes</h4>
                <ul>
                  <li>Please arrive at least 30 minutes before your scheduled events</li>
                  <li>All contestants must check in at the registration desk upon arrival</li>
                  <li>Schedule may be subject to slight changes - check for updates regularly</li>
                </ul>
              </div>
              <div className="action-buttons">
                <button className="primary-button">
                  <FontAwesomeIcon icon={faCalendarAlt} className="button-icon" />
                  Add to Calendar
                </button>
                <button className="outline-button">
                  <FontAwesomeIcon icon={faDownload} className="button-icon" />
                  Download Schedule
                </button>
              </div>
            </div>
          )}
          
          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="tab-content categories-tab">
              <h3 className="tab-heading">Your Registered Categories</h3>
              <div className="categories-list">
                {categories.map((category, index) => (
                  <div className="category-card" key={index}>
                    <div className="category-header">
                      <h4>{category}</h4>
                      <span className="category-number">Category {index + 1}</span>
                    </div>
                    <div className="category-details">
                      <p className="category-description">
                        {getCategoryDescription(category)}
                      </p>
                      {getCategoryCriteria(category).length > 0 && (
                        <div className="category-criteria">
                          <h5>Judging Criteria</h5>
                          <ul>
                            {getCategoryCriteria(category).map((criteria, critIndex) => (
                              <li key={critIndex}>{criteria}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="category-tips">
                        <h5>Tips for Success</h5>
                        <p>{getCategoryTips(category)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="empty-state">
                  <p>No categories found for this pageant.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Results Tab (for completed pageants) */}
          {activeTab === 'results' && pageant.status === 'completed' && (
            <div className="tab-content results-tab">
              <h3 className="tab-heading">Your Results</h3>
              
              {/* Overall placement */}
              <div className="results-overview">
                <div className="overall-placement">
                  <h4>Overall Placement</h4>
                  <div className={`placement-badge ${getPlacementClass(pageant.overallPlacement)}`}>
                    <FontAwesomeIcon icon={faMedal} className="badge-icon" />
                    <span className="placement-text">
                      {pageant.overallPlacement}{getOrdinalSuffix(pageant.overallPlacement)} Place
                    </span>
                  </div>
                </div>
                <div className="results-summary">
                  <h4>Summary</h4>
                  <p>
                    You competed in {pageant.categories.length} categories and achieved an overall placement of 
                    {' '}{pageant.overallPlacement}{getOrdinalSuffix(pageant.overallPlacement)} place. 
                    {pageant.overallPlacement <= 3 ? 
                      ' Congratulations on your outstanding performance!' : 
                      ' Thank you for your participation and hard work.'}
                  </p>
                </div>
              </div>
              
              {/* Category results */}
              <div className="category-results">
                <h4>Category Results</h4>
                <div className="results-table-wrapper">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th className="text-center">Placement</th>
                        <th className="text-center">Score</th>
                        <th>Judge's Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageant.categories.map((cat, index) => (
                        <tr key={index}>
                          <td>{typeof cat === 'string' ? cat : cat.category}</td>
                          <td className={`text-center ${getPlacementColor(cat.placement)}`}>
                            {cat.placement ? `${cat.placement}${getOrdinalSuffix(cat.placement)}` : '--'}
                          </td>
                          <td className="text-center">{cat.score ? cat.score.toFixed(1) : '--'}</td>
                          <td className="comments-cell">
                            {cat.notes || getRandomComment(cat.category, cat.placement)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="primary-button">
                  <FontAwesomeIcon icon={faDownload} className="button-icon" />
                  Download Certificate
                </button>
                <button className="outline-button">
                  <FontAwesomeIcon icon={faShare} className="button-icon" />
                  Share Results
                </button>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="tab-content documents-tab">
              <h3 className="tab-heading">Pageant Documents</h3>
              <div className="documents-list">
                {documentsData.map((doc, index) => (
                  <div className="document-card" key={index}>
                    <div className="document-icon">
                      <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <div className="document-details">
                      <h4>{doc.name}</h4>
                      <div className="document-meta">
                        <span className="document-type">{doc.type}</span>
                        <span className="document-size">{doc.size}</span>
                        <span className="document-date">{formatDate(doc.date)}</span>
                      </div>
                    </div>
                    <button className="download-button">
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="action-buttons">
                <button className="primary-button">
                  <FontAwesomeIcon icon={faDownload} className="button-icon" />
                  Download All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for category content
const getCategoryDescription = (category) => {
  const descriptions = {
    'Evening Gown': 'Contestants will present themselves in formal evening wear. Judging will focus on poise, confidence, and overall presentation.',
    'Talent': 'Showcase your unique talents in a performance of up to 90 seconds. Performances can include singing, dancing, playing musical instruments, and more.',
    'Interview': 'A panel of judges will ask questions to evaluate your communication skills, confidence, and personality.',
    'Swimwear': 'Contestants will model swimwear while being judged on fitness, confidence, and stage presence.',
    'Casual Wear': 'Present yourself in stylish casual attire while showcasing personality and confidence on stage.',
    'Formal Wear': 'Similar to Evening Gown, this category focuses on elegant formal attire and stage presence.',
    'Winter Theme Costume': 'A creative category where contestants design and model winter-themed costumes.',
    'Question and Answer': 'Contestants will respond to questions that test their critical thinking and communication skills.',
    'Photogenic': 'Judged based on submitted photographs evaluating photogenic qualities.',
    'On-Stage Question': 'Contestants answer questions on stage to demonstrate poise and articulation under pressure.',
    'Personality Interview': 'A more relaxed interview focusing on personality and conversational skills.',
    'Nature Talent': 'A talent showcase with themes related to nature or environmental awareness.',
    'Floral Couture': 'Contestants present outfits incorporating floral elements or inspired by botanical themes.',
    'Environmental Q&A': 'Questions focused on environmental awareness and sustainability issues.'
  };
  
  return descriptions[category] || 'Showcase your skills and talents in this exciting category.';
};

const getCategoryRequirements = (category) => {
  const requirements = {
    'Evening Gown': [
      'Floor-length formal gown',
      'Appropriate undergarments',
      'Formal footwear (heels recommended)',
      'Minimal and tasteful accessories'
    ],
    'Talent': [
      'Performance limited to 90 seconds',
      'Props must be approved in advance',
      'Background music on USB drive in MP3 format',
      'Technical requirements submitted by deadline'
    ],
    'Interview': [
      'Professional attire (business suit or dress)',
      'Resume/bio submitted in advance',
      'Be prepared to discuss current events',
      'Research pageant organization and sponsors'
    ],
    'Swimwear': [
      'One-piece or two-piece swimsuit (age-appropriate)',
      'Cover-up for before/after presentation',
      'No excessive jewelry',
      'Appropriate footwear (heels or sandals)'
    ],
    'Formal Wear': [
      'Floor-length formal attire',
      'Age-appropriate design',
      'Proper fit and alterations',
      'Practice walking and turning in outfit'
    ],
    'Winter Theme Costume': [
      'Original costume design',
      'Written description of concept',
      'Safe construction (no hazardous elements)',
      'Must be able to walk and move independently'
    ]
  };
  
  return requirements[category] || [
    'Review category guidelines in contestant handbook',
    'Submit required forms by deadline',
    'Follow age-appropriate standards',
    'Prepare according to pageant theme'
  ];
};

const getCategoryCriteria = (category) => {
  const criteria = {
    'Evening Gown': ['Poise and grace (30%)', 'Stage presence (25%)', 'Overall appearance (25%)', 'Confidence (20%)'],
    'Talent': ['Technical ability (35%)', 'Stage presence (25%)', 'Entertainment value (25%)', 'Originality (15%)'],
    'Interview': ['Communication skills (30%)', 'Content of answers (30%)', 'Personality (20%)', 'Confidence (20%)'],
    'Swimwear': ['Physical fitness (30%)', 'Confidence (25%)', 'Stage presence (25%)', 'Overall appearance (20%)'],
    'Formal Wear': ['Poise and grace (30%)', 'Stage presence (25%)', 'Overall appearance (25%)', 'Confidence (20%)'],
    'Question and Answer': ['Content of answer (40%)', 'Delivery (30%)', 'Confidence (20%)', 'Time management (10%)'],
    'On-Stage Question': ['Content of answer (40%)', 'Delivery (30%)', 'Poise under pressure (20%)', 'Confidence (10%)'],
    'Personality Interview': ['Authenticity (30%)', 'Engagement (25%)', 'Communication skills (25%)', 'Overall impression (20%)'],
    'Floral Couture': ['Design creativity (35%)', 'Technical execution (25%)', 'Stage presentation (25%)', 'Overall impact (15%)'],
    'Environmental Q&A': ['Knowledge depth (40%)', 'Articulation (30%)', 'Passion for subject (20%)', 'Critical thinking (10%)']
  };
  
  return criteria[category] || [];
};

const getCategoryTips = (category) => {
  const tips = {
    'Evening Gown': 'Practice your walk and turns. Choose a gown that complements your body type and personal style.',
    'Talent': 'Choose something youre passionate about and practice regularly. Keep your performance within the time limit.',
    'Interview': 'Stay informed about current events. Practice answering questions concisely and thoughtfully.',
    'Swimwear': 'Focus on confidence and posture. Choose a swimsuit that makes you feel comfortable and confident.',
    'Casual Wear': 'Select an outfit that reflects your personal style while remaining appropriate for the pageant.',
    'Formal Wear': 'Choose attire that fits well and complements your features. Practice walking in your chosen footwear.',
    'Winter Theme Costume': 'Be creative and original with your design while ensuring you can move comfortably.',
    'Question and Answer': 'Practice speaking clearly and concisely. Have a friend ask you unexpected questions to prepare.',
    'Photogenic': 'Choose photographs that capture your natural beauty and personality. Professional photos are recommended.',
    'On-Stage Question': 'Listen carefully to the question before answering. Its okay to take a moment to gather your thoughts.',
    'Personality Interview': 'Be authentic and let your personality shine through. Smile and maintain eye contact.',
    'Nature Talent': 'Incorporate natural elements or environmental themes into your performance for added impact.',
    'Floral Couture': 'Consider both aesthetics and practicality in your design. Ensure your outfit is secure and comfortable.',
    'Environmental Q&A': 'Research current environmental issues and be prepared to offer thoughtful perspectives.'
  };
  
  return tips[category] || 'Prepare thoroughly and showcase your authentic self. Confidence is key to success in this category.';
};

const getCategoryChecklist = (category) => {
  const baseChecklist = [
    'Review category guidelines',
    'Prepare outfit/materials',
    'Practice presentation',
    'Pack backup items'
  ];
  
  const specificChecklist = {
    'Evening Gown': [
      'Alterations completed',
      'Shoes broken in',
      'Jewelry selected',
      'Practice walking in gown'
    ],
    'Talent': [
      'Music/background track ready',
      'Props prepared',
      'Costume finalized',
      'Full run-through practiced'
    ],
    'Interview': [
      'Research current events',
      'Practice common questions',
      'Outfit selected and fitted',
      'Resume submitted'
    ],
    'Swimwear': [
      'Swimsuit selected and fitted',
      'Cover-up prepared',
      'Shoes selected',
      'Self-tanning (if desired)'
    ]
  };
  
  return specificChecklist[category] || baseChecklist;
};

const getPlacementClass = (placement) => {
  if (!placement) return 'badge-participation';
  
  switch (placement) {
    case 1: return 'badge-gold';
    case 2: return 'badge-silver';
    case 3: return 'badge-bronze';
    default: return 'badge-participation';
  }
};

const getRandomComment = (category, placement) => {
  if (!placement) return 'No comments available.';
  
  const excellentComments = [
    'Outstanding performance. Exceptional stage presence and confidence.',
    'Truly impressive. One of the best performances in this category.',
    'Excellent presentation with remarkable poise and grace.',
    'Exceptional skill level demonstrated. Very professional execution.'
  ];
  
  const goodComments = [
    'Very good performance. Strong stage presence with minor areas for improvement.',
    'Well executed with good technique and presentation.',
    'Confident performance with good skill level demonstrated.',
    'Strong showing with good connection to the audience.'
  ];
  
  const averageComments = [
    'Good effort with several areas that could use improvement.',
    'Adequate performance. Consider focusing on stage presence and confidence.',
    'Shows potential but needs more polish and practice.',
    'Satisfactory performance with room for growth in technique.'
  ];
  
  if (placement <= 3) {
    return excellentComments[Math.floor(Math.random() * excellentComments.length)];
  } else if (placement <= 5) {
    return goodComments[Math.floor(Math.random() * goodComments.length)];
  } else {
    return averageComments[Math.floor(Math.random() * averageComments.length)];
  }
};

const getDocumentDescription = (documentName) => {
  const descriptions = {
    'Contestant Information Packet': 'Comprehensive guide to the pageant including schedule, rules, and expectations.',
    'Schedule & Itinerary': 'Detailed timeline of all pageant events, locations, and times.',
    'Pageant Rules & Guidelines': 'Official rules, judging criteria, and code of conduct for all contestants.',
    'Venue Map': 'Layout of the competition venue with key locations marked.'
  };
  
  return descriptions[documentName] || 'Important document for pageant contestants.';
};

PageantDetailsModal.propTypes = {
  pageant: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PageantDetailsModal;
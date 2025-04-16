// client/src/components/dashboard/ContestantSidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faTrophy, 
  faCalendarPlus, 
  faHome, 
  faFileAlt, 
  faMoneyBillWave, 
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const ContestantSidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Report collapsed state to parent component
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home will happen in the auth context
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      path: '/contestant-dashboard',
      icon: faHome,
      text: 'Dashboard'
    },
    {
      path: '/contestant-dashboard/profile',
      icon: faUser,
      text: 'My Profile'
    },
    {
      path: '/contestant-dashboard/join-pageants',
      icon: faCalendarPlus,
      text: 'Join Pageants'
    },
    {
      path: '/contestant-dashboard/active-pageants',
      icon: faTrophy,
      text: 'Active Pageants'
    },
    {
      path: '/contestant-dashboard/past-pageants',
      icon: faFileAlt,
      text: 'Past Pageants'
    },
    {
      path: '/contestant-dashboard/payments',
      icon: faMoneyBillWave,
      text: 'Payments'
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - visible only on mobile */}
      <button 
        className="mobile-toggle d-md-none position-fixed" 
        onClick={toggleMobileSidebar}
        style={{
          top: '1rem',
          left: mobileOpen ? '16rem' : '1rem',
          zIndex: 1050,
          background: 'var(--secondary-color)',
          color: 'var(--primary-color)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'left 0.3s ease-in-out'
        }}
      >
        <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar */}
      <div 
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: collapsed ? '80px' : '250px',
          backgroundColor: 'var(--secondary-color)',
          transition: 'width 0.3s ease-in-out',
          zIndex: 1040,
          overflowY: 'auto',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="sidebar-header d-flex align-items-center justify-content-between p-3"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            height: '70px'
          }}
        >
          {!collapsed && (
            <div className="logo d-flex align-items-center">
              <h5 className="text-white mb-0">Pageant Portal</h5>
            </div>
          )}
          <button 
            className="toggle-btn d-none d-md-block"
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer'
            }}
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div 
            className="user-info p-3 text-center"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '15px'
            }}
          >
            <div 
              className="user-avatar mx-auto mb-2"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-color)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--secondary-color)'
              }}
            >
              {user && user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h6 className="text-white mb-0">{user ? `${user.firstName} ${user.lastName}` : 'Contestant'}</h6>
            <small className="text-light">{user?.ageGroup || 'Age Group'}</small>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="sidebar-nav mt-3">
          <ul className="nav flex-column" style={{ listStyle: 'none', padding: 0 }}>
            {navItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link 
                  to={item.path} 
                  className={`nav-link d-flex align-items-center py-3 px-3 ${location.pathname === item.path ? 'active' : ''}`}
                  style={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    borderLeft: location.pathname === item.path ? '4px solid var(--brand-color)' : '4px solid transparent',
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ minWidth: '20px' }} />
                  {!collapsed && <span className="ms-3">{item.text}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div 
          className="sidebar-footer mt-auto p-3"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '2rem'
          }}
        >
          <button 
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!collapsed && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Add overlay for mobile */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay d-md-none"
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1030
          }}
        />
      )}
    </>
  );
};

export default ContestantSidebar;
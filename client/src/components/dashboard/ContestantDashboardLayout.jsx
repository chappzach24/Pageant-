// client/src/components/dashboard/ContestantDashboardLayout.jsx
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ContestantSidebar from './DashboardSidebar';
import '../../css/dashboard.css';

const ContestantDashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/contestant-login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="contestant-dashboard-container d-flex">
      <ContestantSidebar onToggle={handleSidebarToggle} />
      
      <div 
        className="dashboard-content-wrapper"
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '250px', // Adjust based on sidebar state
          width: sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
          minHeight: '100vh',
          padding: '20px',
          transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
        }}
      >
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {/* Add CSS for responsive behavior */}
      <style>
        {`
          @media (max-width: 767.98px) {
            .dashboard-content-wrapper {
              margin-left: 0 !important;
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ContestantDashboardLayout;
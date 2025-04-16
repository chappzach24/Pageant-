// client/src/components/dashboard/ContestantDashboardLayout.jsx
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ContestantSidebar from './DashboardSidebar';
import '../../css/dashboard.css';

const ContestantDashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      <ContestantSidebar />
      
      <div 
        className="dashboard-content-wrapper"
        style={{
          marginLeft: '250px', // Default sidebar width
          width: 'calc(100% - 250px)',
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

          @media (min-width: 768px) {
            .sidebar.collapsed + .dashboard-content-wrapper {
              margin-left: 80px;
              width: calc(100% - 80px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ContestantDashboardLayout;
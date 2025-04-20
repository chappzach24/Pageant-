import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OrganizationSidebar from "./OrganizationSidebar";
import "../../css/dashboard.css";

const OrganizationDashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Only check if user is authenticated, don't check role
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
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
    <div className="organization-dashboard-container d-flex">
      <OrganizationSidebar onToggle={handleSidebarToggle} />

      <div
        className="dashboard-content-wrapper"
        style={{
          marginLeft: sidebarCollapsed ? "80px" : "250px", // Adjust based on sidebar state
          width: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 250px)",
          minHeight: "100vh",
          padding: "20px",
          transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          backgroundColor: "#f8f9fa",
        }}
      >
        <main
          className="dashboard-content"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
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
          .organization-dashboard-container {
            background-color: #f8f9fa;
            min-height: 100vh;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default OrganizationDashboardLayout;

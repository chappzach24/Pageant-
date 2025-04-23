import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faHome,
  faSignOutAlt,
  faBars,
  faTimes,
  faTrophy,
  faChartBar,
  faUsers,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

const OrganizationSidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user's organizations
  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/organizations/user`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch organizations");

      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

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
      console.error("Logout error:", error);
    }
  };

  // Main navigation items
  const navItems = [
    {
      path: "/organization-dashboard",
      icon: faHome,
      text: "Dashboard",
    },
    {
      path: "/organization-dashboard/organizations",
      icon: faBuilding,
      text: "My Organizations",
    },
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
          top: "1rem",
          left: mobileOpen ? "16rem" : "1rem",
          zIndex: 1050,
          background: "var(--secondary-color)",
          color: "var(--primary-color)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "left 0.3s ease-in-out",
        }}
      >
        <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: collapsed ? "80px" : "250px",
          backgroundColor: "var(--secondary-color)",
          transition: "width 0.3s ease-in-out",
          zIndex: 1040,
          overflowY: "auto",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="sidebar-header d-flex align-items-center justify-content-between p-3"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            height: "70px",
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
              background: "transparent",
              border: "none",
              color: "var(--primary-color)",
              cursor: "pointer",
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
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "15px",
            }}
          >
            <div
              className="user-avatar mx-auto mb-2"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--brand-color)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "var(--secondary-color)",
              }}
            >
              {user && user.firstName
                ? user.firstName.charAt(0).toUpperCase()
                : "U"}
            </div>
            <h6 className="text-white mb-0">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </h6>
            <small className="text-light">{user?.email || ""}</small>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="sidebar-nav mt-3">
          <div className="nav-section mb-2">
            {!collapsed && (
              <div className="nav-section-header px-3 mb-2">
                <small className="text-uppercase text-light opacity-75">
                  Main
                </small>
              </div>
            )}
            <ul
              className="nav flex-column"
              style={{ listStyle: "none", padding: 0 }}
            >
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center py-3 px-3 ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    style={{
                      color: "var(--primary-color)",
                      textDecoration: "none",
                      borderLeft:
                        location.pathname === item.path
                          ? "4px solid var(--brand-color)"
                          : "4px solid transparent",
                      backgroundColor:
                        location.pathname === item.path
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      style={{ minWidth: "20px" }}
                    />
                    {!collapsed && <span className="ms-3">{item.text}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations Section */}
          {!loading && organizations.length > 0 && (
            <div className="nav-section mb-2">
              {!collapsed && (
                <div className="nav-section-header px-3 mb-2">
                  <small className="text-uppercase text-light opacity-75">
                    My Organizations
                  </small>
                </div>
              )}
              <ul
                className="nav flex-column"
                style={{ listStyle: "none", padding: 0 }}
              >
                {organizations.map((org) => (
                  <li className="nav-item" key={org._id}>
                    <Link
                      to={`/organization-dashboard/organizations/${org._id}/pageants`}
                      className={`nav-link d-flex align-items-center py-3 px-3 ${
                        location.pathname.includes(`/organizations/${org._id}`)
                          ? "active"
                          : ""
                      }`}
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                        borderLeft: location.pathname.includes(
                          `/organizations/${org._id}`
                        )
                          ? "4px solid var(--brand-color)"
                          : "4px solid transparent",
                        backgroundColor: location.pathname.includes(
                          `/organizations/${org._id}`
                        )
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrophy}
                        style={{ minWidth: "20px" }}
                      />
                      {!collapsed && (
                        <span
                          className="ms-3 text-truncate"
                          style={{ maxWidth: "170px" }}
                        >
                          {org.name}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Settings Section */}
          <div className="nav-section mt-4">
            {!collapsed && (
              <div className="nav-section-header px-3 mb-2">
                <small className="text-uppercase text-light opacity-75">
                  Settings
                </small>
              </div>
            )}
            <ul
              className="nav flex-column"
              style={{ listStyle: "none", padding: 0 }}
            >
              <li className="nav-item">
                <Link
                  to="/organization-dashboard/settings"
                  className={`nav-link d-flex align-items-center py-3 px-3 ${
                    location.pathname.includes("/settings") ? "active" : ""
                  }`}
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                    borderLeft: location.pathname.includes("/settings")
                      ? "4px solid var(--brand-color)"
                      : "4px solid transparent",
                    backgroundColor: location.pathname.includes("/settings")
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FontAwesomeIcon icon={faCog} style={{ minWidth: "20px" }} />
                  {!collapsed && <span className="ms-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Logout Button */}
        <div
          className="sidebar-footer mt-auto p-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
            style={{
              justifyContent: collapsed ? "center" : "flex-start",
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
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1030,
          }}
        />
      )}
    </>
  );
};

export default OrganizationSidebar;

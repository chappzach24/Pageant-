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
  faGavel,
  faFileAlt,
  faBell,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

const OrganizationSidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3); // Example notification count
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

  useEffect(() => {
    // console.log(`${organizations[0]._id}`)
  })

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
      exact: true
    },
    {
      path: "/organization-dashboard/organizations",
      icon: faBuilding,
      text: "My Organizations",
      badge: organizations.length > 0 ? organizations.length : null
    },
    {
      path: `/organization-dashboard/${organizations[0]?._id}/pageants`,
      icon: faTrophy,
      text: "All Pageants"
    },
    {
      path: `/organization-dashboard/${organizations[0]?._id}/participants`,
      icon: faUsers,
      text: "Participants"
    },
    {
      path: "/organization-dashboard/judges",
      icon: faGavel,
      text: "Judges"
    },
    {
      path: "/organization-dashboard/reports",
      icon: faChartBar,
      text: "Reports & Analytics"
    }
  ];

  // Settings and system items
  const systemItems = [
    {
      path: "/organization-dashboard/notifications",
      icon: faBell,
      text: "Notifications",
      badge: notifications > 0 ? notifications : null
    },
    {
      path: "/organization-dashboard/settings",
      icon: faCog,
      text: "Settings"
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check if current path matches nav item
  const isActiveNavItem = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
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
          <div className="nav-section mb-3">
            {!collapsed && (
              <div className="nav-section-header px-3 mb-2">
                <small className="text-uppercase text-light opacity-75">
                  Main Menu
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
                      isActiveNavItem(item) ? "active" : ""
                    }`}
                    style={{
                      color: "var(--primary-color)",
                      textDecoration: "none",
                      borderLeft: isActiveNavItem(item)
                        ? "4px solid var(--brand-color)"
                        : "4px solid transparent",
                      backgroundColor: isActiveNavItem(item)
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={item.icon}
                          style={{ minWidth: "20px" }}
                        />
                        {!collapsed && <span className="ms-3">{item.text}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className="badge bg-primary ms-2">{item.badge}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations Section */}
          {!loading && organizations.length > 0 && (
            <div className="nav-section mb-3">
              {!collapsed && (
                <div className="nav-section-header px-3 mb-2 d-flex justify-content-between align-items-center">
                  <small className="text-uppercase text-light opacity-75">
                    Quick Access
                  </small>
                  <Link 
                    to="/organization-dashboard/organizations/new"
                    className="btn btn-sm btn-outline-light"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    title="Create New Organization"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </div>
              )}
              <ul
                className="nav flex-column"
                style={{ listStyle: "none", padding: 0 }}
              >
                {organizations.slice(0, 3).map((org) => (
                  <li className="nav-item" key={org._id}>
                    <Link
                      to={`/organization-dashboard/organizations/${org._id}/pageants`}
                      className={`nav-link d-flex align-items-center py-2 px-3 ${
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
                        fontSize: "0.9rem"
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBuilding}
                        style={{ minWidth: "20px", fontSize: "0.8rem" }}
                      />
                      {!collapsed && (
                        <span
                          className="ms-3 text-truncate"
                          style={{ maxWidth: "150px" }}
                          title={org.name}
                        >
                          {org.name}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {organizations.length > 3 && !collapsed && (
                  <li className="nav-item">
                    <Link
                      to="/organization-dashboard/organizations"
                      className="nav-link d-flex align-items-center py-2 px-3"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        opacity: 0.8
                      }}
                    >
                      <span className="ms-3">
                        +{organizations.length - 3} more...
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* System Items */}
          <div className="nav-section mt-4">
            {!collapsed && (
              <div className="nav-section-header px-3 mb-2">
                <small className="text-uppercase text-light opacity-75">
                  System
                </small>
              </div>
            )}
            <ul
              className="nav flex-column"
              style={{ listStyle: "none", padding: 0 }}
            >
              {systemItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center py-3 px-3 ${
                      isActiveNavItem(item) ? "active" : ""
                    }`}
                    style={{
                      color: "var(--primary-color)",
                      textDecoration: "none",
                      borderLeft: isActiveNavItem(item)
                        ? "4px solid var(--brand-color)"
                        : "4px solid transparent",
                      backgroundColor: isActiveNavItem(item)
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={item.icon}
                          style={{ minWidth: "20px" }}
                        />
                        {!collapsed && <span className="ms-3">{item.text}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className="badge bg-danger ms-2">{item.badge}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
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
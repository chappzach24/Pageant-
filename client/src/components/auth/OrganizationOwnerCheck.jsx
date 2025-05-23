import { useState, useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OrganizationOwnerCheck = ({ redirectPath = "/organization-dashboard" }) => {
  const { user } = useAuth();
  const { organizationId } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        // Get the organization details
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/organizations/${organizationId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch organization details");
        }

        const data = await response.json();

        // Check if the current user is the owner of this organization
        if (data.organization && data.organization.owner === user.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error checking organization ownership:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && organizationId) {
      checkOwnership();
    } else {
      setLoading(false);
    }
  }, [organizationId, user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default OrganizationOwnerCheck;
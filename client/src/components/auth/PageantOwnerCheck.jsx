import { useState, useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PageantOwnerCheck = ({ redirectPath = "/dashboard" }) => {
  const { user } = useAuth();
  const { pageantId } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        // Get the pageant details including organization info
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/pageants/${pageantId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pageant details");
        }

        const data = await response.json();

        const organization = data.pageant.organization;
        if (organization && organization.owner === user.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error checking pageant ownership:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && pageantId) {
      checkOwnership();
    } else {
      setLoading(false);
    }
  }, [pageantId, user]);

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

export default PageantOwnerCheck;

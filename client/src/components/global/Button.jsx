import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Button = ({ text = "Default Text", mode = "light", to = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (to === "/organization-dashboard" && !user) {
      // If not logged in, redirect to login page first
      navigate("/login");
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <>
      <button
        className={`button-wrap ${
          mode === "dark" ? "button-dark" : "button-light"
        }`}
        onClick={handleClick}
      >
        {text}
      </button>
    </>
  );
};

export default Button;

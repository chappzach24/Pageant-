// client/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import Button from "../components/global/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await login(email, password);
      navigate("/dashboard"); // Redirect to dashboard or home after login
    } catch (error) {
      setErrorMessage(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrap min-vh-100 d-flex align-items-center justify-content-center u-background-primary">
      <div className="auth-container u-container" style={{ maxWidth: "480px" }}>
        <div className="auth-card p-4 p-md-5 rounded shadow">
          <div className="auth-header text-center mb-4">
            <h2 className="u-text-dark">Welcome Back</h2>
            <p className="u-text-dark">
              Log in to access your pageant dashboard
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column u-gap-m">
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                />
                <label
                  className="form-check-label u-text-dark"
                  htmlFor="remember"
                >
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="u-text-dark">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="text-center mt-3">
              <p className="u-text-dark mb-0">
                Don't have an account?{" "}
                <Link to="/signup" className="u-text-brand">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

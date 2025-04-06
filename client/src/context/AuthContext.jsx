// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // First check if backend is available
        const pingResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Small timeout to quickly detect if server is unreachable
          signal: AbortSignal.timeout(3000)
        }).catch(() => null);

        if (!pingResponse) {
          console.warn("Backend server appears to be offline");
          setBackendAvailable(false);
          setLoading(false);
          return;
        }

        setBackendAvailable(true);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    if (!backendAvailable) {
      throw new Error("Cannot connect to the server. Please check your connection or try again later.");
    }

    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    if (!backendAvailable) {
      throw new Error("Cannot connect to the server. Please check your connection or try again later.");
    }

    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    if (!backendAvailable) {
      // Just clear user state if backend is unavailable
      setUser(null);
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear the user state even if logout API fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      backendAvailable 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
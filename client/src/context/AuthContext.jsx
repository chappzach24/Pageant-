import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Get the API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // First check if backend is available by pinging a backend endpoint
        const pingResponse = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
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
        
        // If we get here, the server responded (even if with an error)
        if (pingResponse.ok) {
          const data = await pingResponse.json();
          setUser(data.user);
        } else {
          // Server is available but user is not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setBackendAvailable(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [API_URL]);

  // Login function
  const login = async (email, password) => {
    if (!backendAvailable) {
      throw new Error("Cannot connect to the server. Please check your connection or try again later.");
    }

    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
      const response = await fetch(`${API_URL}/api/auth/register`, {
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

  // Register as contestant function - Direct API call to avoid recursion
  const registerContestant = async (contestantData) => {
    if (!backendAvailable) {
      throw new Error("Cannot connect to the server. Please check your connection or try again later.");
    }

    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/contestant-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contestantData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Contestant registration failed');
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
      await fetch(`${API_URL}/api/auth/logout`, {
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
      registerContestant,
      logout, 
      backendAvailable 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth as a named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
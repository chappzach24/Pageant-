// client/src/main.jsx
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ContestantSignup from './pages/ContestantSignup.jsx';
import ContestantLogin from './pages/ContestantLogin.jsx';
import { AuthProvider } from './context/AuthContext';

// Dashboard Components
import ContestantDashboardLayout from './components/dashboard/ContestantDashboardLayout.jsx';
import ContestantDashboardHome from './pages/dashboard/ContestantDashboardHome.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'contestant-signup',
        element: <ContestantSignup />
      },
      {
        path: 'contestant-login',
        element: <ContestantLogin />
      },
      // Contestant Dashboard Routes
      {
        path: 'contestant-dashboard',
        element: <ContestantDashboardLayout />,
        children: [
          {
            index: true,
            element: <ContestantDashboardHome />
          }
          // Additional dashboard routes will be added here
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
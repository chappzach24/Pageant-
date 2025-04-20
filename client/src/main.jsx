import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ContestantSignup from "./pages/ContestantSignup.jsx";
import ContestantLogin from "./pages/ContestantLogin.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Contestant Dashboard Components
import ContestantDashboardLayout from "./components/dashboard/ContestantDashboardLayout.jsx";
import ContestantDashboardHome from "./pages/dashboard/ContestantDashboardHome.jsx";
import ContestantProfile from "./pages/dashboard/ContestantProfile.jsx";
import JoinPageant from "./pages/dashboard/JoinPageant.jsx";
import MyPageants from "./pages/dashboard/MyPageants.jsx";
import PastPageants from "./pages/dashboard/PastPageants.jsx";
import ContestantPayments from "./pages/dashboard/ContestantPayments.jsx";

// Organization Dashboard Components
import OrganizationDashboardLayout from "./components/dashboard/OrganizationDashboardLayout.jsx";
import OrganizationDashboardHome from "./pages/dashboard/OrganizationDashboardHome.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "contestant-signup",
        element: <ContestantSignup />,
      },
      {
        path: "contestant-login",
        element: <ContestantLogin />,
      },

      // Protected organizer routes
      {
        element: <ProtectedRoute redirectPath="/login" />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          // Organization Dashboard Route
          {
            path: "organization-dashboard",
            element: <OrganizationDashboardLayout />,
            children: [
              {
                index: true,
                element: <OrganizationDashboardHome />,
              },
              // Additional organization routes will be added here
            ],
          },
        ],
      },

      // Protected contestant routes
      {
        element: <ProtectedRoute redirectPath="/contestant-login" />,
        children: [
          {
            path: "contestant-dashboard",
            element: <ContestantDashboardLayout />,
            children: [
              {
                index: true,
                element: <ContestantDashboardHome />,
              },
              {
                path: "profile",
                element: <ContestantProfile />,
              },
              {
                path: "join-pageant",
                element: <JoinPageant />,
              },
              {
                path: "my-pageants",
                element: <MyPageants />,
              },
              {
                path: "past-pageants",
                element: <PastPageants />,
              },
              {
                path: "payments",
                element: <ContestantPayments />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

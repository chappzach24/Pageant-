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
import OrganizationOwnerCheck from "./components/auth/OrganizationOwnerCheck.jsx";

// Contestant Dashboard Components
import ContestantDashboardLayout from "./components/dashboard/ContestantDashboardLayout.jsx";
import ContestantDashboardHome from "./pages/dashboard/ContestantDashboardHome.jsx";
import ContestantProfile from "./pages/dashboard/ContestantProfile.jsx";
import JoinPageant from "./pages/dashboard/JoinPageant.jsx";
import MyPageants from "./pages/dashboard/MyPageants.jsx";
import PastPageants from "./pages/dashboard/PastPageants.jsx";
import ContestantPayments from "./pages/dashboard/ContestantPayments.jsx";
import JoinPageantSuccess from "./pages/dashboard/JoinPageantSuccess.jsx";

// Organization Dashboard Components
import OrganizationDashboardLayout from "./components/dashboard/OrganizationDashboardLayout.jsx";
import OrganizationDashboardHome from "./pages/dashboard/OrganizationDashboardHome.jsx";
import PageantManagement from "./pages/dashboard/PageantManagement.jsx";
import AddPageant from "./pages/dashboard/AddPageant.jsx";
import ScoringDashboard from "./pages/dashboard/ScoringDashboard.jsx";
import PageantScoringPage from "./pages/dashboard/PageantScoringPage.jsx";

import OrganizationParticipants from "./pages/dashboard/OrganizationParticipants.jsx";
import OrganizationReports from "./pages/dashboard/OrganizationReports.jsx";


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
              {
                path: "scoring",
                element: <ScoringDashboard />,
              },
              // NEW SCORING ROUTES
              {
                path: "scoring/pageant/:pageantId",
                element: <PageantScoringPage />,
              },
              {
                path: "scoring/pageant/:pageantId/results", 
                element: <h1>Results Page (Coming Soon)</h1>,
              },
              // Protected organization-specific routes - users can only access their own organizations
              {
                path: "organizations/:organizationId",
                element: <OrganizationOwnerCheck />,
                children: [
                  {
                    path: "pageants",
                    element: <PageantManagement />,
                  },
                  {
                    path: "pageants/new",
                    element: <AddPageant />,
                  },
                  {
                    path: 'participants',
                    element: <OrganizationParticipants />
                  },
                  {
                    path: 'reports',
                    element: <OrganizationReports />,
                  },
                ],
              },
              // Protected pageant-specific routes
              {
                path: "pageants/:pageantId/view",
                element: <h1>View Pageant (Coming Soon)</h1>,
              },
              {
                path: "pageants/:pageantId/edit",
                element: <h1>Edit Pageant (Coming Soon)</h1>,
              },
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
                path: 'join-pageant/success',
                element: <JoinPageantSuccess />
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
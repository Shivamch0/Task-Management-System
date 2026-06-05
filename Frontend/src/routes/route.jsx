//? Imports
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Setting";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  //? Public landing page.
  {
    path: '/',
    element: <Landing />,
  },
  //? Auth pages share one centered layout.
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  //? Protected task app routes.
  {
    path: '/dashboard',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  //? Catch all unknown routes.
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

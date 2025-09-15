import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import SetNewPassword from "../pages/login/SetNewPassword";
import PasswordUpdateLogin from "../pages/login/PasswordUpdateLogin";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../components/NotFound";
import Test from "../Test";
import UserManagement from "../pages/usersManagement/UserManagement";
import CheckCode from "../pages/login/CheckCode";
import Administrators from "../pages/administrators/Administrators";
import Payments from "../pages/payments/Payments";
import Products from "../pages/products/Products";
import PrivateRoute from "./PrivateRoute";
import Categories from "../pages/categories/Categories";
import Agents from "../pages/agents/Agents";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/check-code",
    element: <CheckCode />,
  },
  {
    path: "/set-new-password",
    element: <SetNewPassword />,
  },
  {
    path: "/password-update-login",
    element: <PasswordUpdateLogin />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/user-management",
        element: <UserManagement />,
      },
      {
        path: "/administrators",
        element: <Administrators />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/payments",
        element: <Payments />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },

      {
        path: "/agents",
        element: <Agents />,
      },

      {
        path: "/test",
        element: <Test />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import FileSystemManage from "@/pages/FileSystem";
import Login from "@/pages/Login";
import UserManage from "@/pages/User";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "file-system",
        element: <FileSystemManage />,
      },
      {
        path: "user-manage",
        element: <UserManage />,
      },
    ],
  },
]);

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./App.css";

import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { SyncMusicDashboard } from "./pages/SyncMusicDashboard";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/login" replace />
    },
    {
      path: "/login",
      element: <AuthPage />
    },
    {
      path: "/signup",
      element: <AuthPage />
    },
    {
      path: "/join-room",
      element: <Dashboard />
    },
    {
      path: "/create-room",
      element: <Dashboard />
    },
    {
      path: "/sync-music",
      element: <SyncMusicDashboard />
    }
  ],
  {
    future: {
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
import { AuthProvider } from "@/auth/AuthProvider";
import { PrivateRoute } from "@/auth/PrivateRoute";
import MainLayout from "@/layouts/main-layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import Projects from "@/pages/projects";
import Reports from "@/pages/reports";
import Teams from "@/pages/teams";
import TimeEntries from "@/pages/time-entries";

function AppRouter() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return isLogin ? (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  ) : (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/time-entries"
          element={
            <PrivateRoute>
              <TimeEntries />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute requiredRole="admin">
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AuthProvider>
            <Router>
              <AppRouter />
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

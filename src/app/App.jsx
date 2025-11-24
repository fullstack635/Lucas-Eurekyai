import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/layout/Layout';
import Dashboard from '../features/dashboard';
import Lists from '../features/lists';
import Calendar from '../features/calendar';
import CalendarCallback from '../features/calendar/CalendarCallback';
import Settings from '../features/settings';
import Register from '../features/auth';
import Login from '../features/auth/Login';
import Landing from '../features/landing';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import QueryProvider from './providers/QueryProvider';
import { AppProvider } from '../shared/contexts/AppContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

function App() {
  return (
    <QueryProvider>
      <AppProvider>
        <TooltipProvider>
          <ThemeSwitcher className="hidden" />
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/lists" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Lists />} />
              </Route>
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Settings />} />
              </Route>
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AppProvider>
    </QueryProvider>
  );
}

export default App

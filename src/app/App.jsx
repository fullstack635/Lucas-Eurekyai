import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/layout/Layout';
import Dashboard from '../features/dashboard';
import Lists from '../features/lists';
import Calendar from '../features/calendar';
import CalendarCallback from '../features/calendar/CalendarCallback';
import Settings from '../features/settings';
import Register from '../features/auth';
import Login from '../features/auth/Login';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import QueryProvider from './providers/QueryProvider';
import { AppProvider } from '../shared/contexts/AppContext';

function App() {
  return (
    <QueryProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* OAuth callback route - protected */}
            <Route path="/calendar/callback" element={
              <ProtectedRoute>
                <CalendarCallback />
              </ProtectedRoute>
            } />

            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="lists" element={<Lists />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </QueryProvider>
  );
}

export default App

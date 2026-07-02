import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Team from './pages/Team';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-cs-mesh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cs-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
  if (!adminOnly && isAdmin) return <Navigate to="/admin" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
          <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
          <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

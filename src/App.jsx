import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { useAuth } from './hooks/useAuth'; // Import useAuth
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';




const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};


const LoginRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route 
          path="/login" 
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
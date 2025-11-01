import { useAuth } from '../hooks/useAuth';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { currentUser } = useAuth();

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  if (currentUser.role === 'student') {
    return <StudentDashboard />;
  }

  return <div>Error: Unknown user role.</div>;
}
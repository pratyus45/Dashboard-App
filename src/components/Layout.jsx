import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-full w-full bg-gray-50">
      
      {/* - NAVBAR - */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        {/* We use max-w-7xl to center the nav content on wide screens */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                MyDashboard
              </Link>
            </div>
            
            {/* User Info & Logout */}
            <div className="flex items-center">
              <span className="hidden sm:inline-block text-gray-700 mr-4">
                Welcome, {currentUser.name} ({currentUser.role})
              </span>
              <button
                onClick={logout}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* - MAIN CONTENT */}
      <main>
        {/* This centers your dashboard content nicely */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
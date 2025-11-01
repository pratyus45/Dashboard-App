import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import * as api from '../services/api';

export default function Login() {
  const { currentUser, login } = useAuth();
  const users = api.getUsers(); 

  
  // Sort the users array to put admins on top
  const sortedUsers = users ? Object.values(users).sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return 0;
  }) : [];
 

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-full w-full bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Log In As
        </h2>
        <div className="space-y-4">
          {/* We now map over the 'sortedUsers' array */}
          {sortedUsers.length > 0 ? (
            sortedUsers.map(user => (
              <button
                key={user.id}
                onClick={() => login(user.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300
                  ${user.role === 'admin' 
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-700 hover:bg-gray-800'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                `}
              >
                <span className="flex justify-between items-center">
                  <span>{user.name}</span>
                  <span className="text-xs opacity-75 capitalize">({user.role})</span>
                </span>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Loading users...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
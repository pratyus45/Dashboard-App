import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import * as api from '../services/api';

export default function Login() {
  const { currentUser, login } = useAuth();
  const users = api.getUsers(); // This might be null on first load

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In As
        </h2>
        <div className="space-y-4">
          {/* THIS IS THE FIX: We check if 'users' exists before trying to map over it.
            'users && Object.values(users)' ensures we don't call Object.values(null).
          */}
          {users && Object.values(users).length > 0 ? (
            Object.values(users).map(user => (
              <button
                key={user.id}
                onClick={() => login(user.id)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              >
                {user.name} ({user.role})
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Loading users or no users found...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
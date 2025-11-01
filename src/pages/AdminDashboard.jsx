import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import Modal from '../components/Modal';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the new assignment form
  const [title, setTitle] = useState('');
  const [driveLink, setDriveLink] = useState('');

  const fetchData = () => {
    const data = api.getAdminDashboard(currentUser.id);
    setDashboardData(data);
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.id]);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    api.createAssignment(currentUser.id, { title, driveLink });
    // Reset form and close modal
    setTitle('');
    setDriveLink('');
    setIsModalOpen(false);
    fetchData(); // Refresh data
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
        >
          + Create Assignment
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.map(assign => (
          <AssignmentCard
            key={assign.id}
            assignment={assign}
            role="admin"
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6">New Assignment</h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700">Drive Link</label>
              <input
                type="url"
                id="driveLink"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="https://docs.google.com/..."
                required
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
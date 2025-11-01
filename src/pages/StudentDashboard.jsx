import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import Modal from '../components/Modal';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchData = () => {
    const data = api.getStudentAssignments(currentUser.id);
    setAssignments(data);
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.id]);

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    api.updateSubmissionStatus(selectedAssignment.submissionId, 'submitted');
    setIsModalOpen(false);
    setSelectedAssignment(null);
    fetchData(); // Refresh data after submission
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assign => (
          <AssignmentCard
            key={assign.id}
            assignment={assign}
            role="student"
            onSubmit={() => handleSubmitClick(assign)}
          />
        ))}
      </div>

      {isModalOpen && selectedAssignment && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
          <p className="mb-6">
            Are you sure you want to submit "{selectedAssignment.title}"?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
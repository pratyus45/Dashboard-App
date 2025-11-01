import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Ensure this import is correct
import * as api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import Modal from '../components/Modal'; // We need the modal

// Button styles for the modal
const modalButtonBase = "w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
const modalButtonPrimary = `${modalButtonBase} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`;
const modalButtonSecondary = `${modalButtonBase} bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400`;

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  
  // --- STATE FOR THE DOUBLE-VERIFICATION ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  // --- END ---

  const fetchData = () => {
    if (currentUser) {
      const data = api.getStudentAssignments(currentUser.id);
      setAssignments(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // --- STEP 1: "Submit" button is clicked ---
  // This function just opens the modal
  const handleSubmitClick = (assignment) => {
    // Only open modal if the assignment is 'pending'
    if (assignment.status === 'pending') {
      setSelectedAssignment(assignment);
      setIsModalOpen(true);
    }
  };

  // --- STEP 2: "Confirm" button is clicked ---
  // This function does the actual API call
  const handleConfirmSubmit = () => {
    if (!selectedAssignment) return;

    api.updateSubmissionStatus(selectedAssignment.submissionId, 'submitted');
    
    // Close modal, clear selection, and refresh data
    setIsModalOpen(false);
    setSelectedAssignment(null);
    fetchData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments && assignments.length > 0 ? (
          assignments.map(assign => (
            <AssignmentCard
              key={assign.id}
              assignment={assign}
              role="student"
              // The card's button now triggers STEP 1
              onSubmit={() => handleSubmitClick(assign)}
            />
          ))
        ) : (
          <p className="text-gray-500">You have no assignments.</p>
        )}
      </div>

      {/* --- THE VERIFICATION MODAL --- */}
      {isModalOpen && selectedAssignment && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Confirm Submission</h3>
          <p className="mb-6 text-gray-700">
            Are you sure you want to submit "{selectedAssignment.title}"?
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={modalButtonSecondary}
            >
              Cancel
            </button>
            <button
              type="button"
              // The "Confirm" button triggers STEP 2
              onClick={handleConfirmSubmit}
              className={modalButtonPrimary}
            >
              Yes, I Have Submitted
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
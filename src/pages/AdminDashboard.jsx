import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import Modal from '../components/Modal';

// Button styles
const modalButtonBase = "w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
const modalButtonPrimary = `${modalButtonBase} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`;
const modalButtonSecondary = `${modalButtonBase} bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400`;

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState([]);
  
  // Modal states
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isManageStudentModalOpen, setIsManageStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false); // <-- NEW EDIT MODAL
  
  // Form states
  const [title, setTitle] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [studentName, setStudentName] = useState('');

  // State for the student list
  const [allStudents, setAllStudents] = useState([]);
  
  //  NEW: State for editing a student *
  const [currentStudentToEdit, setCurrentStudentToEdit] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');

  //  Data Fetching 
  const fetchDashboardData = () => {
    if (currentUser) {
      const data = api.getAdminDashboard(currentUser.id);
      setDashboardData(data);
    }
  };

  const fetchAllStudents = () => {
    const users = api.getUsers();
    if (users) {
      const students = Object.values(users).filter(u => u.role === 'student');
      setAllStudents(students);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  //  Handlers 
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!title || !driveLink || !currentUser) return;
    api.createAssignment(currentUser.id, { title, driveLink });
    setTitle('');
    setDriveLink('');
    setIsAssignmentModalOpen(false);
    fetchDashboardData();
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!studentName) return;
    api.createStudent(studentName);
    setStudentName('');
    setIsStudentModalOpen(false);
    fetchDashboardData();
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      api.deleteStudent(studentId);
      fetchDashboardData();
      fetchAllStudents(); // Refresh the student list in the modal
    }
  };

  //  NEW: HANDLER TO OPEN THE EDIT MODAL 
  const openEditModal = (student) => {
    setCurrentStudentToEdit(student);
    setNewStudentName(student.name); // Pre-fill the input
    setIsEditStudentModalOpen(true);
    setIsManageStudentModalOpen(false); // Close the manage modal
  };

  //  NEW: HANDLER TO SAVE THE STUDENT'S NEW NAME 
  const handleUpdateStudentName = (e) => {
    e.preventDefault();
    if (!newStudentName || !currentStudentToEdit) return;

    api.updateStudentName(currentStudentToEdit.id, newStudentName);
    
    // Close modal and reset states
    setIsEditStudentModalOpen(false);
    setCurrentStudentToEdit(null);
    setNewStudentName('');

    fetchDashboardData(); // Refresh dashboard
    // We don't need to re-fetch all students unless the manage modal is re-opened
  };


  const openManageModal = () => {
    fetchAllStudents(); // Always get fresh list
    setIsManageStudentModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openManageModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600"
          >
            Manage Students
          </button>
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            + Add Student
          </button>
          <button
            onClick={() => setIsAssignmentModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Create Assignment
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData && dashboardData.length > 0 ? (
          dashboardData.map(assign => (
            <AssignmentCard
              key={assign.id}
              assignment={assign}
              role="admin"
            />
          ))
        ) : (
          <p className="text-gray-500">No assignments created yet.</p>
        )}
      </div>

      {/*  "CREATE ASSIGNMENT" MODAL  */}
      {isAssignmentModalOpen && (
        <Modal onClose={() => setIsAssignmentModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6">New Assignment</h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900" required />
            </div>
            <div>
              <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700">Drive Link</label>
              <input type="url" id="driveLink" value={driveLink} onChange={(e) => setDriveLink(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="https://docs.google.com/..." required />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 pt-4">
              <button type="button" onClick={() => setIsAssignmentModalOpen(false)} className={modalButtonSecondary}>Cancel</button>
              <button type="submit" className={modalButtonPrimary}>Create</button>
            </div>
          </form>
        </Modal>
      )}

      {/*  "ADD STUDENT" MODAL  */}
      {isStudentModalOpen && (
        <Modal onClose={() => setIsStudentModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6">Add New Student</h3>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900" required />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 pt-4">
              <button type="button" onClick={() => setIsStudentModalOpen(false)} className={modalButtonSecondary}>Cancel</button>
              <button type="submit" className={modalButtonPrimary}>Add Student</button>
            </div>
          </form>
        </Modal>
      )}

      {/* - "MANAGE STUDENTS" MODAL  */}
      {isManageStudentModalOpen && (
        <Modal onClose={() => setIsManageStudentModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6">Manage Students</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {allStudents.length > 0 ? (
              allStudents.map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-gray-900">{student.name}</span>
                  {/*  NEW BUTTON GROUP (EDIT/DELETE) - */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(student)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No students found.</p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsManageStudentModalOpen(false)}
              className={modalButtonSecondary}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* --- *** NEW: "EDIT STUDENT" MODAL *** --- */}
      {isEditStudentModalOpen && (
        <Modal onClose={() => setIsEditStudentModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6">Edit Student Name</h3>
          <form onSubmit={handleUpdateStudentName} className="space-y-4">
            <div>
              <label htmlFor="newStudentName" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                id="newStudentName"
                value={newStudentName} // Bound to the new state
                onChange={(e) => setNewStudentName(e.target.value)} // Updates the new state
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
                required
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditStudentModalOpen(false)}
                className={modalButtonSecondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={modalButtonPrimary}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
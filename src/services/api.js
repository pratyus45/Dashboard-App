import { initMockData } from '../data/mockData';

// --- Read/Write Functions (Getters/Setters) ---

// SAFER GET: This now checks if data exists. If not, it returns null.
const _get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return null;
  }
};

// SAFER SET: This wraps writing in a try/catch.
const _set = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to write to localStorage: ${key}`, error);
  }
};

// --- API Functions ---

export const initData = () => {
  // This function is in mockData.js and is safe.
  initMockData();
};

export const getUsers = () => {
  return _get('users');
};

export const getStudentAssignments = (studentId) => {
  const allAssignments = _get('assignments');
  const allSubmissions = _get('submissions');

  // CRASH PREVENTION: Check if data exists before filtering
  if (!allAssignments || !allSubmissions) {
    return []; // Return an empty array to prevent crashes
  }

  const mySubmissions = allSubmissions.filter(s => s.studentId === studentId);

  return mySubmissions.map(sub => {
    const assignment = allAssignments.find(a => a.id === sub.assignmentId);
    return {
      ...assignment,
      submissionId: sub.id,
      status: sub.status,
    };
  });
};

export const getAdminDashboard = (adminId) => {
  const allAssignments = _get('assignments');
  const allSubmissions = _get('submissions');
  const allUsers = _get('users');

  // CRASH PREVENTION: Check if data exists
  if (!allAssignments || !allSubmissions || !allUsers) {
    return [];
  }

  const studentCount = Object.values(allUsers).filter(u => u.role === 'student').length;
  const myAssignments = allAssignments.filter(a => a.createdBy === adminId);

  return myAssignments.map(assign => {
    const submissionsForThis = allSubmissions.filter(s => s.assignmentId === assign.id);
    const completed = submissionsForThis.filter(s => s.status === 'submitted' || s.status === 'confirmed').length;
    
    return {
      ...assign,
      totalSubmissions: studentCount,
      completedSubmissions: completed,
      submissions: submissionsForThis.map(s => ({
        ...s,
        studentName: allUsers[s.studentId].name
      }))
    };
  });
};

export const updateSubmissionStatus = (submissionId, newStatus) => {
  const allSubmissions = _get('submissions');
  if (!allSubmissions) return null; // Safety check

  const index = allSubmissions.findIndex(s => s.id === submissionId);
  
  if (index > -1) {
    allSubmissions[index].status = newStatus;
    _set('submissions', allSubmissions);
    return allSubmissions[index];
  }
  return null;
};

export const createAssignment = (adminId, { title, driveLink }) => {
  const allAssignments = _get('assignments') || []; // Default to empty array
  const allSubmissions = _get('submissions') || [];
  const allUsers = _get('users');

  if (!allUsers) return null; // Cannot create if no users exist

  const newAssignment = {
    id: `a${Date.now()}`,
    title,
    driveLink,
    createdBy: adminId,
  };
  allAssignments.push(newAssignment);
  _set('assignments', allAssignments);

  const students = Object.values(allUsers).filter(u => u.role === 'student');
  students.forEach(student => {
    const newSubmission = {
      id: `s${Date.now()}-${student.id}`,
      assignmentId: newAssignment.id,
      studentId: student.id,
      status: 'pending',
    };
    allSubmissions.push(newSubmission);
  });
  _set('submissions', allSubmissions);

  return newAssignment;
};
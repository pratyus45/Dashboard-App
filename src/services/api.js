import { initMockData } from '../data/mockData';

// --- Read/Write Functions (Getters/Setters) ---

const _get = (key) => {
  initMockData(); // Ensures data exists on first read
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return null;
  }
};

const _set = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to write to localStorage: ${key}`, error);
  }
};

// --- API Functions ---

export const getUsers = () => {
  return _get('users');
};

export const createStudent = (name) => {
  const users = _get('users') || {};
  const assignments = _get('assignments') || [];
  const submissions = _get('submissions') || [];

  const newStudentId = `student${Date.now()}`;
  const newStudent = { id: newStudentId, name: name, role: 'student' };
  users[newStudentId] = newStudent;
  _set('users', users);

  assignments.forEach(assignment => {
    const newSubmission = {
      id: `s${Date.now()}-${assignment.id}`,
      assignmentId: assignment.id,
      studentId: newStudentId,
      status: 'pending',
    };
    submissions.push(newSubmission);
  });
  _set('submissions', submissions);

  return newStudent;
};

export const deleteStudent = (studentId) => {
  let users = _get('users') || {};
  let submissions = _get('submissions') || [];

  if (users[studentId]) {
    delete users[studentId];
    _set('users', users);
  }

  let updatedSubmissions = submissions.filter(sub => sub.studentId !== studentId);
  _set('submissions', updatedSubmissions);

  return { users, submissions: updatedSubmissions };
};

// *** NEW: FUNCTION TO UPDATE A STUDENT'S NAME ***
export const updateStudentName = (studentId, newName) => {
  const users = _get('users') || {};
  if (users[studentId]) {
    users[studentId].name = newName;
    _set('users', users);
    return users[studentId];
  }
  return null;
};


export const getStudentAssignments = (studentId) => {
  const allAssignments = _get('assignments');
  const allSubmissions = _get('submissions');
  if (!allAssignments || !allSubmissions) return [];
  const mySubmissions = allSubmissions.filter(s => s.studentId === studentId);
  return mySubmissions.map(sub => {
    const assignment = allAssignments.find(a => a.id === sub.assignmentId);
    return { ...assignment, submissionId: sub.id, status: sub.status };
  });
};

export const getAdminDashboard = (adminId) => {
  const allAssignments = _get('assignments');
  const allSubmissions = _get('submissions');
  const allUsers = _get('users');
  if (!allAssignments || !allSubmissions || !allUsers) return [];

  const studentCount = Object.values(allUsers).filter(u => u.role === 'student').length;
  const myAssignments = allAssignments.filter(a => a.createdBy === adminId);

  return myAssignments.map(assign => {
    const submissionsForThis = allSubmissions.filter(s => s.assignmentId === assign.id);
    const completed = submissionsForThis.filter(s => s.status === 'submitted' || s.status === 'confirmed').length;
    return {
      ...assign,
      totalSubmissions: studentCount,
      completedSubmissions: completed,
      // This will use the new name if it's updated
      submissions: submissionsForThis.map(s => ({ ...s, studentName: allUsers[s.studentId]?.name || 'Deleted User' }))
    };
  });
};

export const updateSubmissionStatus = (submissionId, newStatus) => {
  const allSubmissions = _get('submissions');
  if (!allSubmissions) return null;
  const index = allSubmissions.findIndex(s => s.id === submissionId);
  if (index > -1) {
    allSubmissions[index].status = newStatus;
    _set('submissions', allSubmissions);
    return allSubmissions[index];
  }
  return null;
};

export const createAssignment = (adminId, { title, driveLink }) => {
  const allAssignments = _get('assignments') || [];
  const allSubmissions = _get('submissions') || [];
  const allUsers = _get('users');
  if (!allUsers) return null;

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
  _set('submissions', submissions);

  return newAssignment;
};
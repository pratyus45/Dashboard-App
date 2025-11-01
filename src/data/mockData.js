// The raw data that we will use to "seed" our localStorage "database"
const users = {
  "student1": { id: "student1", name: "Rohan Sharma", role: "student" },
  "student2": { id: "student2", name: "Priya Singh", role: "student" },
  "admin1": { id: "admin1", name: "Prof. Gupta", role: "admin" },
};

const assignments = [
  { 
    id: "a1", 
    title: "React Hooks Essay", 
    createdBy: "admin1", 
    driveLink: "https://docs.google.com/..." 
  },
  { 
    id: "a2", 
    title: "CSS Grid Challenge", 
    createdBy: "admin1", 
    driveLink: "https://docs.google.com/..."
  },
];

const submissions = [
  // Submissions for assignment a1
  { id: "s1", assignmentId: "a1", studentId: "student1", status: "pending" },
  { id: "s2", assignmentId: "a1", studentId: "student2", status: "submitted" },
  
  // Submissions for assignment a2
  { id: "s3", assignmentId: "a2", studentId: "student1", status: "pending" },
  { id: "s4", assignmentId: "a2", studentId: "student2", status: "pending" },
];

/**
 * This function seeds localStorage ONLY if it's empty.
 * This simulates a persistent database.
 */
export const initMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  if (!localStorage.getItem('assignments')) {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }
  if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }
};
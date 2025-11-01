React Assignment Dashboard 
This is a simple dashboard for managing student assignments. It's built with React and Tailwind CSS and runs entirely in your browser. All data (students, assignments, submissions) is saved in your browser's localStorage to simulate a real database.

 ## Features
This app has two roles: Admin and Student.

## As an Admin (Professor):
Create Assignments: Add new assignments with a title and a Google Drive link.

## View Dashboard:
 See all assignments and a progress bar for how many students have submitted.

See Who Submitted: Click an assignment to see a list of all students and their individual status (Submitted or Pending).

Add Students: Add new students to the system.

Manage Students: Edit the names of existing students or delete them.

## As a Student:
View Assignments: See a clean list of only your own assignments.

See Status: Clearly see if an assignment is "Pending" or "Submitted."

Submit with Confirmation: When you submit, a popup asks you to confirm (the "double-verification" flow).

## Tech Stack
React.js: For building the user interface.

Tailwind CSS: For all styling.

React Router: For switching between the Login and Dashboard pages.

React Context: To keep track of who is logged in.

LocalStorage: To save all data in your browser.


## How to Run Locally
Follow these 5 steps to run the project on your computer.

Clone the project (or download the files):

Bash

git clone [your-github-repo-url]
Go into the project folder:

Bash

cd [your-project-folder-name]
Install all the needed packages:

Bash

npm install
Start the app:

Bash

npm run dev
import ProgressBar from './ProgressBar';

// A map to make statuses look nice
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
};

export default function AssignmentCard({ assignment, role, onSubmit }) {
  const { 
    title, 
    driveLink, 
    status, 
    totalSubmissions, 
    completedSubmissions 
  } = assignment;

  const isPending = status === 'pending';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <a 
          href={driveLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:underline mb-4 block"
        >
          View Drive Link
        </a>
      </div>
      
      {role === 'student' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status] || 'bg-gray-100'}`}
            >
              {status}
            </span>
          </div>
          <button
            onClick={onSubmit}
            disabled={!isPending}
            className={`w-full py-2 px-4 rounded-md font-semibold text-white
              ${isPending 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            {isPending ? 'Submit Assignment' : 'Submitted'}
          </button>
        </div>
      )}

      {role === 'admin' && (
        <div>
          <ProgressBar 
            total={totalSubmissions} 
            current={completedSubmissions} 
          />
          <p className="text-sm text-gray-600 text-center mt-2">
            {completedSubmissions} of {totalSubmissions} students submitted
          </p>
        </div>
      )}
    </div>
  );
}
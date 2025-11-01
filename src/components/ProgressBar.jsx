export default function ProgressBar({ total, current }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
    </div>
  );
}
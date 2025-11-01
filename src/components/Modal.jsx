export default function Modal({ onClose, children }) {
  return (
    // Backdrop
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click-through to backdrop
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50"
      >
        {children}
      </div>
    </div>
  );
}
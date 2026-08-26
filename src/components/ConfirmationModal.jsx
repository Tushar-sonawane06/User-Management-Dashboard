import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function ConfirmationModal({ user, loading, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // Focus cancel button on open
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // ESC to close
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Close confirmation"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
          <div>
            <h2 id="confirm-title" className="text-base font-semibold text-slate-800 mb-1">
              Delete User
            </h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete{' '}
              <span className="font-medium text-slate-700">{user?.name}</span>?{' '}
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-gray-100
                         hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(user.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                         text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

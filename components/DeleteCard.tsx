import React from 'react';
interface ConfirmDeleteCardProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmDeleteCard({ open, onCancel, onConfirm } : ConfirmDeleteCardProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-3">Are you sure?</h2>
        <p className="text-gray-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

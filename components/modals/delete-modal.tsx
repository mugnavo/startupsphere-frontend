import React from "react";
import { CircleX } from "lucide-react";

interface DeleteConfirmationModalProps {
  onDelete: () => void; 
  onClose: () => void; 
}

// this isn't final, it is subject to changes and improvements.
export default function DeleteConfirmationModal({
  onDelete,
  onClose,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded-lg bg-white p-6 text-center shadow-lg">
        <CircleX className="mx-auto mb-4 h-24 w-24 text-red-500" />
        <h2 className="mb-2 text-lg font-bold">Are you sure?</h2>
        <p className="mb-4 text-sm text-gray-500">
          Do you really want to delete this record? This process cannot be undone.
        </p>
        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={onDelete} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

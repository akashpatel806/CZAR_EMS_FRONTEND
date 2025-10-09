import React from "react";

export default function ErrorComponent({ 
  message = "Something went wrong!", 
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">⚠️ Error</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}

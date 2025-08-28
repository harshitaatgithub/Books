import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 animate-pulse"></div>
      </div>
      <span className="ml-4 text-gray-600 font-medium">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;

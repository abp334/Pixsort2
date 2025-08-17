import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="flex space-x-2">
        <div className="h-4 bg-gray-300 rounded-full w-16"></div>
        <div className="h-4 bg-gray-300 rounded-full w-20"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="h-8 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  </div>
);
export default SkeletonCard;

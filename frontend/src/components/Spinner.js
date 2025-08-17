// frontend/src/components/Spinner.js
import React from "react";
const Spinner = ({ small }) => (
  <div className="flex justify-center items-center">
    <div
      className={`animate-spin rounded-full border-b-2 border-indigo-600 ${
        small ? "h-5 w-5" : "h-8 w-8"
      }`}
    ></div>
  </div>
);
export default Spinner;

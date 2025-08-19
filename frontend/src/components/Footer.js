// frontend/src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Pixsort Marketplace. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

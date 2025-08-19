import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  PhotoIcon,
  ShoppingBagIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 dark:bg-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <PhotoIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                Pixsort
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/marketplace">
              <ShoppingBagIcon className="h-5 w-5 mr-1" />
              Marketplace
            </NavLink>
            {userInfo ? (
              <>
                <NavLink to="/my-images">
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  My Images
                </NavLink>
                <NavLink to="/upload">
                  <CloudArrowUpIcon className="h-5 w-5 mr-1" />
                  Upload
                </NavLink>
                <button
                  onClick={logoutHandler}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Login
                </NavLink>
                <Link
                  to="/signup"
                  className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

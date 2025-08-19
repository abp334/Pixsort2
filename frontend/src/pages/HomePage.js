import React from "react";
import { Link } from "react-router-dom";
import {
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Feature = ({ icon, title, children }) => (
  <div className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
      {children}
    </p>
  </div>
);

const HomePage = () => {
  return (
    <>
      <div className="relative bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                  <span className="block xl:inline">AI-Powered Image</span>{" "}
                  <span className="block text-indigo-600 xl:inline">
                    Marketplace
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 dark:text-gray-300">
                  Upload your images, let our AI categorize them instantly, and
                  start selling on our vibrant marketplace. Discover unique
                  content from creators around the world.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/marketplace"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Marketplace
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/upload"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://uc.uncg.edu/wp-content/uploads/2023/05/PIC40215-URE_IARc_Class_Trip_Wild_Dunes_2966_1920px.jpg"
            alt="AI art"
          />
        </div>
      </div>
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wider uppercase dark:text-indigo-400">
              How it works
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl dark:text-white">
              A smarter way to manage and sell your photos
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-3">
            <Feature
              icon={<CloudArrowUpIcon className="h-6 w-6" />}
              title="Upload & Analyze"
            >
              Upload your image and our powerful AI will instantly analyze and
              tag it with detailed and overall categories.
            </Feature>
            <Feature
              icon={<MagnifyingGlassIcon className="h-6 w-6" />}
              title="Search & Discover"
            >
              Our smart search allows you and others to find images based on the
              AI-generated tags, making discovery effortless.
            </Feature>
            <Feature
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              title="List & Sell"
            >
              Easily list your categorized images on the marketplace with your
              desired price and start earning.
            </Feature>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;

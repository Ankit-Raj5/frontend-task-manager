import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Welcome to Task Manager</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Manage your tasks efficiently and keep track of your progress with our easy-to-use platform.
      </p>
      <Link
        to="/signup"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;

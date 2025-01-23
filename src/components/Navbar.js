import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/dashboard" className="text-blue-500 font-bold">Dashboard</Link>
        <Link to="/tasks" className="text-blue-500 font-bold">Task List</Link>
      </div>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;

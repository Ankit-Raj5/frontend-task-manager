import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard";
import TaskList from "./components/TasklList";
import Home from "./components/Home";
import TaskForm from "./components/TaskForm";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar"; // Import Navbar component

// Simulate authentication status
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Assuming a token is stored in localStorage after login
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout Component for Authenticated Users
const ProtectedLayout = ({ children }) => {
  return (
    <div>
      <Navbar /> {/* Display Navbar for authenticated users */}
      <main>{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <TaskList />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <TaskForm />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

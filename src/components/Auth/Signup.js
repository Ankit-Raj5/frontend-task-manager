import React, { useState } from "react";
import { signup } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // console.log("********")
    e.preventDefault();
    try {
      const {data} =await signup(formData);
      console.log(data)
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h1>
        
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;

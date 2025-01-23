import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-5w8r.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("/users/login", data);
export const signup = (data) => API.post("/users/register", data);

export const createTask = (task) => API.post("/tasks", task);
export const getTasks = (params) => API.get("/tasks", { params });
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const getStatistics = () => API.get("/tasks/statistics");

import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Login user
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

// Register user
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

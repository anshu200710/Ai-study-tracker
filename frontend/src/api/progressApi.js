import axios from "axios";

const API = axios.create({ baseURL: "/api/progress" });

export const getProgress = async (token) => {
  const { data } = await API.get("/", { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const updateProgress = async (token, progressData) => {
  const { data } = await API.post("/update", progressData, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

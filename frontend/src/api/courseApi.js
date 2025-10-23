import axios from "axios";

const API = axios.create({ baseURL: "/api/courses" });

export const getAllCourses = async (token) => {
  const { data } = await API.get("/", { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getRecommendedCourses = async (token) => {
  const { data } = await API.get("/recommended", { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

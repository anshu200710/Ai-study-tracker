import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: `${BASE_URL}/api/courses` });

const getAuthHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getAllCourses = async (token) => {
  try {
    const { data } = await API.get("/", getAuthHeaders(token));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCourseById = async (id, token) => {
  try {
    const { data } = await API.get(`/${id}`, getAuthHeaders(token));
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createCourse = async (token, courseData) => {
  try {
    const { data } = await API.post("/", courseData, getAuthHeaders(token));
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const enrollCourse = async (id, token) => {
  try {
    const { data } = await API.post(`/enroll/${id}`, {}, getAuthHeaders(token));
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getEnrolledCourses = async (token) => {
  try {
    const { data } = await API.get("/enrolled/me", getAuthHeaders(token));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/chat" });

export const askQuestion = async (token, question) => {
  const { data } = await API.post(
    "/ask",
    { question },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

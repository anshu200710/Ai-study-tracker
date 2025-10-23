import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // import it

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // get user here
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return; // wait for user to be loaded
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/chat/history", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
         // If res.data is an object with messages array
    const messagesArray = Array.isArray(res.data) ? res.data : res.data.messages || [];
    messagesArray.forEach((msg) => addMessage(msg));
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, [user]); // run when user is available

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

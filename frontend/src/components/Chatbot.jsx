import { useState, useContext, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { askQuestion } from "../api/chatApi";

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const { messages, addMessage } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


  const handleSend = async () => {
  if (!input) return;
  addMessage({ role: "user", content: input });

  try {
    const response = await askQuestion(user.token, input);
    addMessage({ role: "assistant", content: response.answer });
  } catch (err) {
    console.error(err);
    addMessage({ role: "assistant", content: "Sorry, something went wrong." });
  }

  setInput("");
};


useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  return (
    <div className="p-4 border rounded h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className={msg.role === "user" ? "bg-blue-200 inline-block p-2 rounded" : "bg-gray-200 inline-block p-2 rounded"}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded ml-2">
          Send
        </button>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatbot;

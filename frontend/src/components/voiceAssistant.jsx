// src/components/VoiceAssistant.jsx
import React, { useEffect, useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { askQuestion } from "../api/chatApi";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = SpeechRecognition ? new SpeechRecognition() : null;

const VoiceAssistant = () => {
  const { user } = useContext(AuthContext);
  const { addMessage } = useContext(ChatContext);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!recog) return;
    recog.lang = "en-IN"; // default; allow UI to change
    recog.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      addMessage({ role: "user", content: text });
      const resp = await askQuestion(user.token, text);
      addMessage({ role: "assistant", content: resp.answer });
      // speak
      const utter = new SpeechSynthesisUtterance(resp.answer);
      utter.lang = "en-IN";
      window.speechSynthesis.speak(utter);
    };
    recog.onend = () => setListening(false);
  }, [user]);

  const toggle = () => {
    if (!recog) return alert("Your browser doesn't support speech recognition");
    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      recog.start();
      setListening(true);
    }
  };

  return (
    <div className="p-2">
      <button onClick={toggle} className={`px-4 py-2 rounded ${listening ? 'bg-red-400' : 'bg-green-400'}`}>
        {listening ? "Stop Listening" : "Speak"}
      </button>
    </div>
  );
};

export default VoiceAssistant;

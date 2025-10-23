// import askAI from "../services/aiService.js";
// import ChatHistory from "../models/ChatHistory.js";

// export const askQuestion = async (req, res) => {
//   try {
//     const { question } = req.body;
//     const answer = await askAI(question);

//     await ChatHistory.create({
//       user: req.user.id,
//       messages: [
//         { role: "user", content: question },
//         { role: "assistant", content: answer },
//       ],
//     });

//     res.json({ question, answer });
//   } catch (error) {
//     res.status(500).json({ message: "Chat failed", error: error.message });
//   }
// };


// backend/controllers/chatController.js
import { askAI } from "../services/aiService.js";

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question required" });

    const answer = await askAI({ userId: req.user.id, question });
    res.json({ question, answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat failed", error: error.message });
  }
};


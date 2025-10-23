// backend/services/aiService.js
import openai from "../config/openai.js"; // your OpenAI client wrapper
import ChatHistory from "../models/ChatHistory.js";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

const systemPrompt = `
You are an empathetic AI tutor for distance learners at IGNOU.
Answer concisely and cite course/module names when relevant.
If you don't know, say you don't know and suggest resources/study strategies.
Always ask clarifying questions if the user's query lacks context.
Limit answers to 800 words.
`;

const buildContext = async (userId) => {
  // Pull last few chat messages + short progress summary
  const lastChats = await ChatHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(6);
  const progress = await Progress.find({ user: userId }).populate("course").limit(10);

  const progressSummary = progress.map(p => `${p.course.title}: ${p.progressPercent}%`).join("\n") || "No progress yet.";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "system", content: `Learner progress summary:\n${progressSummary}` },
  ];

  // Add last chat messages in chronological order
  const chron = lastChats.reverse();
  chron.forEach(h => {
    h.messages.forEach(m => messages.push({ role: m.role, content: m.content }));
  });

  return messages;
};

export const askAI = async ({ userId, question, temperature = 0.2 }) => {
  try {
    const messages = await buildContext(userId);
    messages.push({ role: "user", content: question });

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini", // use your preferred model; fall back to gpt-3.5-turbo if needed
      messages,
      temperature,
      max_tokens: 800,
    });

    const assistantText = resp.choices?.[0]?.message?.content || "Sorry, I couldn't answer that.";

    // Save to chat history
    await ChatHistory.create({
      user: userId,
      messages: [
        { role: "user", content: question },
        { role: "assistant", content: assistantText },
      ],
    });

    return assistantText;
  } catch (err) {
    console.error("askAI error:", err);
    return "Sorry, something went wrong while talking to the AI.";
  }
};
export default askAI;

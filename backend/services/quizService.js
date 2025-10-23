// backend/services/quizService.js
import openai from "../config/openai.js";
import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";

export const generateQuizFromTopic = async ({ userId, courseId, topic, numQuestions = 5 }) => {
  const course = await Course.findById(courseId);

  const prompt = `
  Generate ${numQuestions} mixed questions (MCQ, True/False, short answer) for the topic "${topic}" in the course "${course?.title || 'General'}".
  Output JSON only with structure:
  { "title": "...", "questions":[ { "type":"mcq","question":"", "options":["..."], "answer": 1, "explanation": "..." }, ... ] }
  Keep options for MCQs to 4 choices.
  `;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 900,
  });

  const content = resp.choices?.[0]?.message?.content || "";
  let quizJSON;
  try {
    quizJSON = JSON.parse(content);
  } catch (err) {
    // attempt to extract JSON block
    const match = content.match(/\{[\s\S]*\}/);
    quizJSON = match ? JSON.parse(match[0]) : null;
  }

  if (!quizJSON) throw new Error("Failed to generate quiz JSON");

  const quiz = await Quiz.create({
    title: quizJSON.title || `Quiz: ${topic}`,
    course: courseId,
    generatedByAI: true,
    questions: quizJSON.questions,
    createdBy: userId,
  });

  return quiz;
};

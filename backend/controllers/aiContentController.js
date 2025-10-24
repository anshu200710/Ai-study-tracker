import Course from "../models/Course.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧩 Generate Flashcards from course content
export const generateFlashcards = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const prompt = `
    Generate 5 flashcards based on this course:
    Title: ${course.title}
    Description: ${course.description}
    Each flashcard should be a short JSON object like:
    { "question": "...", "answer": "..." }
    Return JSON array only.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Parse JSON safely
    let flashcards;
    try {
      flashcards = JSON.parse(response.choices[0].message.content);
    } catch {
      flashcards = [];
    }

    course.flashcards = flashcards;
    await course.save();

    res.json({ message: "✅ Flashcards generated", flashcards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating flashcards", error: error.message });
  }
};

// 🧠 Generate MCQs from course content
export const generateMCQs = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const prompt = `
    Generate 5 multiple-choice questions (MCQs) from this course:
    Title: ${course.title}
    Description: ${course.description}
    Each question should have 4 options and a correct answer.
    Format response as JSON array like:
    [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A"
      }
    ]
    Return JSON only.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let mcqs;
    try {
      mcqs = JSON.parse(response.choices[0].message.content);
    } catch {
      mcqs = [];
    }

    course.mcqs = mcqs;
    await course.save();

    res.json({ message: "✅ MCQs generated", mcqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating MCQs", error: error.message });
  }
};

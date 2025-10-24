import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";

const CourseContentPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [learnedFlashcards, setLearnedFlashcards] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id, user.token);
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course content:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchCourse();
  }, [id, user]);

  if (loading) return <p>Loading course content...</p>;
  if (!course) return <p>No course found.</p>;

  // ✅ Toggle learned flashcard
  const toggleLearned = (index) => {
    setLearnedFlashcards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{course.title} - Content</h1>

      {/* Flashcards Section */}
      {course.flashcards?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📚 Flashcards</h2>
          {course.flashcards.map((f, i) => (
            <div
              key={i}
              className={`border p-4 rounded mb-2 transition-all ${
                learnedFlashcards.includes(i) ? "bg-green-100" : "bg-white"
              }`}
            >
              <p><strong>Q:</strong> {f.question}</p>
              <details>
                <summary>Answer</summary>
                <p>{f.answer}</p>
              </details>
              <button
                onClick={() => toggleLearned(i)}
                className={`mt-2 px-3 py-1 rounded text-white ${
                  learnedFlashcards.includes(i)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {learnedFlashcards.includes(i) ? "Mark as Unlearned" : "Mark as Learned"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MCQs Section */}
      {course.mcqs?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">🧠 MCQs</h2>
          {course.mcqs.map((m, i) => {
            const [selected, setSelected] = useState(null);
            return (
              <div key={i} className="border p-3 rounded mb-2">
                <p><strong>{m.question}</strong></p>
                <ul className="list-disc ml-6">
                  {m.options.map((opt, j) => (
                    <li
                      key={j}
                      onClick={() => setSelected(opt)}
                      className={`cursor-pointer p-1 rounded ${
                        selected === opt
                          ? opt === m.correctAnswer
                            ? "bg-green-200"
                            : "bg-red-200"
                          : ""
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                {selected && (
                  <p className="mt-1 text-sm text-gray-700">
                    Correct answer: <strong>{m.correctAnswer}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseContentPage;

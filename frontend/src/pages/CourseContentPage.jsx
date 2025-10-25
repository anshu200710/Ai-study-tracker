import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, generateFlashcards, generateMCQs } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";

const CourseContentPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [learnedFlashcards, setLearnedFlashcards] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

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

  if (loading) return <p className="text-center mt-10">Loading course content...</p>;
  if (!course) return <p className="text-center mt-10">No course found.</p>;

  // Toggle flashcard learned state
  const toggleLearned = (index) => {
    setLearnedFlashcards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle MCQ option select
  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionIndex]: option }));
  };

  // Generate new flashcards (replace)
  const handleGenerateFlashcards = async () => {
    try {
      const newFlashcards = await generateFlashcards(course._id, user.token);
      setCourse((prev) => ({
        ...prev,
        flashcards: newFlashcards.flashcards,
      }));
      alert("✅ Flashcards generated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate flashcards.");
    }
  };

  // Generate more flashcards (append)
  const handleGenerateMoreFlashcards = async () => {
    try {
      const newFlashcards = await generateFlashcards(course._id, user.token);
      setCourse((prev) => ({
        ...prev,
        flashcards: [...(prev.flashcards || []), ...(newFlashcards.flashcards || [])],
      }));
      alert("✅ More flashcards generated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate more flashcards.");
    }
  };

  // Generate new MCQs (replace)
  const handleGenerateMCQs = async () => {
    try {
      const newMCQs = await generateMCQs(course._id, user.token);
      setCourse((prev) => ({
        ...prev,
        mcqs: newMCQs.mcqs,
      }));
      alert("✅ MCQs generated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate MCQs.");
    }
  };

  // Generate more MCQs (append)
  const handleGenerateMoreMCQs = async () => {
    try {
      const newMCQs = await generateMCQs(course._id, user.token);
      setCourse((prev) => ({
        ...prev,
        mcqs: [...(prev.mcqs || []), ...(newMCQs.mcqs || [])],
      }));
      alert("✅ More MCQs generated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate more MCQs.");
    }
  };

  // YouTube embed
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">{course.title}</h1>

      {/* Video */}
      {course.videoUrl && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🎥 Course Video</h2>
          <div className="aspect-video rounded-lg overflow-hidden shadow">
            <iframe
              className="w-full h-full"
              src={getYoutubeEmbedUrl(course.videoUrl)}
              title={course.title}
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* PDF Notes */}
      {course.pdfUrl && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📄 Notes</h2>
          <a
            href={course.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Open Course Notes
          </a>
        </div>
      )}

      {/* Generate Buttons */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button onClick={handleGenerateFlashcards} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Generate Flashcards
        </button>
        <button onClick={handleGenerateMoreFlashcards} className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">
          Generate More Flashcards
        </button>
        <button onClick={handleGenerateMCQs} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Generate MCQs
        </button>
        <button onClick={handleGenerateMoreMCQs} className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500">
          Generate More MCQs
        </button>
      </div>

      {/* Flashcards */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📚 Flashcards</h2>
        {course.flashcards?.length > 0 ? (
          course.flashcards.map((f, i) => (
            <div key={i} className={`border p-4 rounded mb-3 transition-all ${learnedFlashcards.includes(i) ? "bg-green-100" : "bg-gray-50"}`}>
              <p className="font-medium mb-2"><strong>Q:</strong> {f.question}</p>
              <details>
                <summary className="cursor-pointer text-blue-600">Show Answer</summary>
                <p className="mt-1">{f.answer}</p>
              </details>
              <button onClick={() => toggleLearned(i)} className={`mt-3 px-3 py-1 rounded text-white text-sm ${learnedFlashcards.includes(i) ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                {learnedFlashcards.includes(i) ? "Mark as Unlearned" : "Mark as Learned"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No flashcards available.</p>
        )}
      </div>

      {/* MCQs */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">🧠 MCQs</h2>
        {course.mcqs?.length > 0 ? (
          course.mcqs.map((m, i) => {
            const selected = selectedOptions[i];
            return (
              <div key={i} className="border p-4 rounded mb-3 bg-gray-50">
                <p className="font-medium mb-2">{m.question}</p>
                <ul className="space-y-1">
                  {m.options.map((opt, j) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === m.correctAnswer;
                    return (
                      <li key={j} onClick={() => handleOptionSelect(i, opt)}
                        className={`cursor-pointer p-2 rounded border transition ${isSelected ? isCorrect ? "bg-green-200 border-green-400" : "bg-red-200 border-red-400" : "hover:bg-blue-100"}`}>
                        {opt}
                      </li>
                    );
                  })}
                </ul>
                {selected && (
                  <p className="mt-2 text-sm text-gray-700">
                    Correct answer: <strong className="text-green-700">{m.correctAnswer}</strong>
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No MCQs available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContentPage;

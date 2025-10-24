import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, enrollCourse, generateFlashcards, generateMCQs } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";


import { useNavigate } from "react-router-dom";



const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // inside your component
const navigate = useNavigate();

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id, user.token);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    if (user?.token) fetchCourse();
  }, [id, user]);

  // ✅ Handle enrollment
  const handleEnroll = async () => {
    try {
      await enrollCourse(course._id, user.token);
      setMessage("✅ Enrolled successfully!");
    } catch {
      setMessage("❌ Failed to enroll");
    }
  };

  // ✅ Generate Flashcards (admin only)
  const handleGenerateFlashcards = async () => {
    setLoading(true);
    try {
      const res = await generateFlashcards(course._id, user.token);
      setMessage(res.message || "Flashcards generated!");
      const updated = await getCourseById(course._id, user.token);
      setCourse(updated);
    } catch (err) {
      setMessage("❌ Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate MCQs (admin only)
  const handleGenerateMCQs = async () => {
    setLoading(true);
    try {
      const res = await generateMCQs(course._id, user.token);
      setMessage(res.message || "MCQs generated!");
      const updated = await getCourseById(course._id, user.token);
      setCourse(updated);
    } catch (err) {
      setMessage("❌ Failed to generate MCQs");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <p>Loading...</p>;

  // ✅ Extract YouTube Embed
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const youtubeEmbed = getYoutubeEmbedUrl(course.videoUrl);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>

      {/* YouTube Video */}
      <div className="aspect-video mb-4">
        <iframe
          src={youtubeEmbed}
          title={course.title}
          className="w-full h-full rounded"
          allowFullScreen
        ></iframe>
      </div>

      {/* PDF Material */}
      {course.pdfUrl && (
        <a
          href={course.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 underline mb-4"
        >
          📄 View PDF Material
        </a>
      )}

      {/* Messages */}
      {message && <p className="mb-3 text-green-700">{message}</p>}

      {/* Enroll Button */}
      <button
        onClick={handleEnroll}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enroll Now
      </button>

      {/* AI Content Buttons (Admin Only) */}
      {user.role === "admin" && (
        <div className="mt-4 space-x-2">
          <button
            onClick={handleGenerateFlashcards}
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            ⚡ {loading ? "Generating..." : "Generate Flashcards"}
          </button>

          <button
            onClick={handleGenerateMCQs}
            disabled={loading}
            className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            🧠 {loading ? "Generating..." : "Generate MCQs"}
          </button>
        </div>
      )}

      {/* Flashcards */}
      {course.flashcards?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">📚 Flashcards</h2>
          {course.flashcards.map((f, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p><strong>Q:</strong> {f.question}</p>
              <details>
                <summary>Answer</summary>
                <p>{f.answer}</p>
              </details>
            </div>
          ))}
        </div>
      )}

      {/* MCQs */}
      {course.mcqs?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">🧠 MCQs</h2>
          {course.mcqs.map((m, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p><strong>{m.question}</strong></p>
              <ul className="list-disc ml-6">
                {m.options.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
              <p className="text-green-700"><strong>Correct:</strong> {m.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}

      <button
  onClick={() => navigate(`/courses/${course._id}/content`)}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  View Flashcards & MCQs
</button>
    </div>
  );
};

export default CourseDetail;

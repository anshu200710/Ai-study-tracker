import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, enrollCourse } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseById(id, user.token);
      setCourse(data);
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await enrollCourse(course._id, user.token);
      setMessage("✅ Enrolled successfully!");
    } catch (err) {
      setMessage("❌ Failed to enroll");
    }
  };

  if (!course) return <p>Loading...</p>;

  // extract YouTube embed
  const youtubeEmbed = course.videoUrl?.replace("watch?v=", "embed/");

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>

      <div className="aspect-video mb-4">
        <iframe
          src={youtubeEmbed}
          title={course.title}
          className="w-full h-full rounded"
          allowFullScreen
        ></iframe>
      </div>

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

      {message && <p className="mb-3">{message}</p>}
      <button
        onClick={handleEnroll}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enroll Now
      </button>
    </div>
  );
};

export default CourseDetail;

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllCourses } from "../api/courseApi";
import { Link } from "react-router-dom";

const Courses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses(user.token);
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Unexpected response:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  if (loading) return <p className="p-6">Loading courses...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              <p className="mt-2 text-sm">Level: {c.difficulty}</p>
              <Link
                to={`/courses/${c._id}`}
                className="inline-block mt-3 text-blue-600 font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;

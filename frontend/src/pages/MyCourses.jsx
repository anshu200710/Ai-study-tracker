import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getEnrolledCourses } from "../api/courseApi";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const data = await getEnrolledCourses(user.token);
      setCourses(data);
    };
    fetchMyCourses();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Enrolled Courses</h1>
      {courses.length === 0 ? (
        <p>You haven’t enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              <Link
                to={`/courses/${c._id}`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                Continue →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

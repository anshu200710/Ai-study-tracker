import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllCourses, getRecommendedCourses } from "../api/courseApi";
import { mockCourses } from "../assets/assets";
const Courses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);


  


  useEffect(() => {
    const fetchCourses = async () => {
      setCourses(mockCourses)
      // setCourses(await getAllCourses(user.token));
      setRecommended(await getRecommendedCourses(user.token));
    };
    fetchCourses();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-wrap">
        {courses.map((c) => (
          <div key={c._id} className="p-4 border rounded m-2 w-60">{c.title}</div>
        ))}
      </div>
      {/* <h2 className="text-xl font-bold mt-6 mb-2">Recommended for You</h2>
      <div className="flex flex-wrap">
        {recommended.map((c) => (
          <div key={c._id} className="p-4 border rounded m-2 w-60">{c.title}</div>
        ))}
      </div> */}
    </div>
  );
};

export default Courses;

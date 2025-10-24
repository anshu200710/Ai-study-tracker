import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../api/courseApi";

const AdminCourses = () => {
  const { user } = useContext(AuthContext);
  console.log(user.token);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
    difficulty: "beginner",
  });
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    const data = await getAllCourses(user.token);
    setCourses(data);
  };

  useEffect(() => {
    if (user?.token) loadCourses();
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCourse(editingId, user.token, form);
        setMessage("✅ Course updated!");
      } else {
        await createCourse(user.token, form);
        setMessage("✅ Course added!");
      }
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        pdfUrl: "",
        difficulty: "beginner",
      });
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setMessage("❌ Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingId(course._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id, user.token);
      setMessage("🗑️ Course deleted!");
      loadCourses();
    } catch {
      setMessage("❌ Failed to delete course");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Course" : "Add New Course"}
      </h1>
      {message && <p className="mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="videoUrl"
          placeholder="YouTube Video URL"
          value={form.videoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="pdfUrl"
          placeholder="Google Drive PDF Link"
          value={form.pdfUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Course" : "Add Course"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Courses</h2>
      <div className="space-y-3">
        {courses.map((c) => (
          <div
            key={c._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.difficulty}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;

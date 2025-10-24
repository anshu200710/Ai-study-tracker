import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createCourse } from "../api/courseApi";

const AdminCourses = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
    difficulty: "beginner",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(user.token, form);
      setMessage("✅ Course added successfully!");
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        pdfUrl: "",
        difficulty: "beginner",
      });
    } catch (err) {
      setMessage("❌ Failed to add course");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
      {message && <p className="mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AdminCourses;

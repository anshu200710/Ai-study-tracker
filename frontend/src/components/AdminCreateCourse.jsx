import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createCourse } from "../api/courseApi";
import { useNavigate } from "react-router-dom";

const AdminCreateCourse = () => {
  const { user } = useContext(AuthContext);
  console.log(user.token);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    videoUrl: "",
    pdfUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createCourse(user.token, form);
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Create New Course</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
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
        <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input
          type="text"
          name="videoUrl"
          placeholder="YouTube Video URL"
          value={form.videoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="pdfUrl"
          placeholder="Google Drive PDF URL"
          value={form.pdfUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateCourse;

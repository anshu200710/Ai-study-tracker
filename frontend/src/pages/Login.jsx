import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser, registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Define handleChange to update form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = isRegister
        ? await registerUser(form) // if you implement registration
        : await loginUser({ email: form.email, password: form.password });

      login(data); // save user + token in context and localStorage

      // Redirect based on admin credentials
      if (data.email === "ap@gmail.com") {
        navigate("/admin/courses");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 shadow-lg rounded-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Name Field (Only for Registration) */}
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border p-2 mb-4 w-full rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        {/* Toggle Link */}
        <p className="text-center mt-4 text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;

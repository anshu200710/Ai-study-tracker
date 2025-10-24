import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const { data } = await axios.post(`${BASE_URL}${endpoint}`, form);
      login(data); // Save user & token in context
      setMessage("✅ Logged in successfully!");
    } catch (err) {
      setMessage("❌ Authentication failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">
        {isRegister ? "Register" : "Login"}
      </h1>
      {message && <p className="mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isRegister ? "Already have an account?" : "No account?"}{" "}
        <button
          className="text-blue-500 underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;

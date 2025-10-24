import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
    console.log(user);
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// // controllers/authController.js
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Hardcoded admin account
//     const ADMIN_EMAIL = "admin@gmail.com";
//     const ADMIN_PASSWORD = "admin";

//     if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//   const token = jwt.sign(
//     { id: "admin-id", role: "admin", email: ADMIN_EMAIL },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   return res.json({
//     _id: "admin-id",
//     name: "Super Admin",
//     email: ADMIN_EMAIL,
//     token, // valid JWT
//     role: "admin",
//   });
// }

//     // Otherwise, normal student login
//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//       role: "student",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Login failed", error: error.message });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // admin or student
      token: jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      ),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

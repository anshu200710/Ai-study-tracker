import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on first mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem("user");
      }
       setLoading(false);
    }
  }, []);

  // ✅ Login (store user + token)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout (clear everything)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  
  if (loading) return <p>Loading...</p>;
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
      } catch (e) {
        console.error("Invalid token:", e);
        localStorage.removeItem("token");
      }
    }
    return null;
  });

  // ✅ Add login function
  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      });
    } catch (e) {
      console.error("Invalid token:", e);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

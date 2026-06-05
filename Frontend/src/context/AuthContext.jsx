//? Imports
import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("zentask_theme") || "light";
    } catch (error) {
      console.error(error);
      return "light";
    }
  });

  const mapUser = (user) => {
    if (!user) return null;

    return {
      ...user,
      id: user._id,
      name: user.name || user.userName || "User",
      avatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${user._id || user.email}`,
    };
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("zentask_theme", nextTheme);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/user/current-user");
        setCurrentUser(mapUser(response.data?.data?.user));
      } catch (error) {
        console.error("Session check failed:", error);
        setCurrentUser(null);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/user/login", { email, password });
      const user = mapUser(response.data?.data?.user);

      if (user) {
        setCurrentUser(user);
        return { success: true };
      }

      return { success: false, message: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/user/register", {
        name,
        email,
        password,
      });
      const user = mapUser(response.data?.data?.user);

      if (user) {
        setCurrentUser(user);
        return { success: true };
      }

      return { success: false, message: "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Email is already registered or fields are invalid",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setCurrentUser(null);
    }
  };

  const updateProfile = async (name, avatarUrl) => {
    //! Backend requirements do not include profile updates, so this stays local.
    const updatedUser = {
      ...currentUser,
      name,
      avatar: avatarUrl || currentUser?.avatar,
    };

    setCurrentUser(updatedUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        theme,
        toggleTheme,
        isAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

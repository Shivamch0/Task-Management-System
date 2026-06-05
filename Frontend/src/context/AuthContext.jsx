import { createContext, useContext, useState, useEffect } from 'react';
import api from '../axios/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Manage theme state
  const [theme, setTheme] = useState(() => {
    try {
      //! Local Storage
      const storedTheme = window.localStorage.getItem('taskflow_theme');
      return storedTheme || 'light';
    } catch (e) {
      console.error(e);
      return 'light';
    }
  });

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      //! Local Storage
      window.localStorage.setItem('taskflow_theme', nextTheme);
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronize HTML element class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check if user is logged in via backend API on mount
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const mapUser = (user) => {
    if (!user) return null;
    return {
      ...user,
      id: user._id,
      name: user.userName,
    };
  };

  // Verify token / get current user on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/user/current-user');
        if (response.data?.data?.user) {
          setCurrentUser(mapUser(response.data.data.user));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setCurrentUser(null);
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/user/login', { email, password });
      if (response.data?.data?.user) {
        const user = mapUser(response.data.data.user);
        setCurrentUser(user);
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/user/register', {
        userName: name,
        email,
        password,
      });
      if (response.data?.data?.user) {
        const user = mapUser(response.data.data.user);
        setCurrentUser(user);
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Email is already registered or invalid fields';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  const updateProfile = async (name, avatarUrl) => {
    try {
      const response = await api.patch('/user/update-profile', {
        userName: name,
        avatar: avatarUrl,
      });
      if (response.data?.data?.user) {
        const user = mapUser(response.data.data.user);
        setCurrentUser(user);
        return { success: true };
      }
      return { success: false, message: 'Failed to update profile' };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, theme, toggleTheme, isAuthenticating }}>
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
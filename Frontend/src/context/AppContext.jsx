//? Imports
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../axios/axios";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapTask = (task) => {
    if (!task) return null;

    return {
      ...task,
      id: task._id,
      completed: task.status === "completed",
      priority: task.priority || "Medium",
      subtasks: task.subtasks || [],
    };
  };

  const fetchTasks = async (showLoading = true) => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    if (showLoading) setIsLoading(true);

    try {
      const response = await api.get("/tasks");
      const rawTasks = response.data?.data?.tasks || [];
      setTasks(rawTasks.map(mapTask));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const createTask = async (taskData) => {
    const { title, description, status } = taskData;

    try {
      const response = await api.post("/tasks", {
        title,
        description,
        status,
      });
      const newTask = mapTask(response.data?.data?.task);

      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }

    return null;
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, taskData);
      const updatedTask = mapTask(response.data?.data?.task);

      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task)),
        );
        return updatedTask;
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }

    return null;
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    } catch (error) {
      console.error("Failed to delete task:", error);
      return false;
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      const updatedTask = mapTask(response.data?.data?.task);

      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task)),
        );
        return updatedTask;
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }

    return null;
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    const nextStatus = task?.status === "completed" ? "pending" : "completed";
    return updateTaskStatus(taskId, nextStatus);
  };

  const taskStats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const pendingTasks = tasks.filter((task) => task.status === "pending");

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate:
        tasks.length > 0
          ? Math.round((completedTasks.length / tasks.length) * 100)
          : 0,
    };
  }, [tasks]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        isLoading,
        taskStats,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        toggleTaskStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../axios/axios";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { currentUser } = useAuth();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapSubtask = (st) => {
    if (!st) return null;
    return {
      ...st,
      id: st._id,
    };
  };

  const mapTask = (t) => {
    if (!t) return null;
    return {
      ...t,
      id: t._id,
      subtasks: (t.subtasks || []).map(mapSubtask),
    };
  };

  const mapProject = (p) => {
    if (!p) return null;
    return {
      ...p,
      id: p._id,
      tasks: (p.tasks || []).map(mapTask),
    };
  };

  const fetchProjects = async (showLoading = true) => {
    if (!currentUser) {
      setProjects([]);
      return;
    }
    if (showLoading) setIsLoading(true);
    try {
      const response = await api.get("/project");

      const rawProjects = response.data?.data || [];
      const mappedProjects = rawProjects.map(mapProject);
      setProjects(mappedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchProjectById = async (projectId, showLoading = true) => {
    if (!currentUser || !projectId) {
      return null;
    }
    if (showLoading) setIsLoading(true);
    try {
      const response = await api.get(`/project/${projectId}`);
      if (response.data?.data) {
        const mappedProject = mapProject(response.data.data);
        setProjects((prev) => {
          const exists = prev.some(
            (project) => project.id === mappedProject.id,
          );
          if (exists) {
            return prev.map((project) =>
              project.id === mappedProject.id ? mappedProject : project,
            );
          }
          return [mappedProject, ...prev];
        });
        return mappedProject;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch project:", error);
      return null;
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(true);
  }, [currentUser]);

  const createProject = async (title, description) => {
    try {
      const response = await api.post("/project", { title, description });
      if (response.data?.data?.project) {
        const newProj = mapProject(response.data.data.project);
        setProjects((prev) => [newProj, ...prev]);

        fetchProjects(false);
        return newProj;
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const updateProject = async (projectId, title, description) => {
    try {
      const response = await api.patch(`/project/${projectId}`, {
        title,
        description,
      });
      if (response.data?.data) {
        const updated = mapProject(response.data.data);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, ...updated } : p)),
        );
        fetchProjectById(projectId, false);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/project/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const createTask = async (projectId, taskData) => {
    const { title, description, priority, dueDate } = taskData;
    try {
      const response = await api.post(`/task/project/${projectId}`, {
        title,
        description,
        priority,
        dueDate,
      });
      if (response.data?.data?.task) {
        const newTask = mapTask(response.data.data.task);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = [...(proj.tasks || []), newTask];
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
        return newTask;
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const updateTask = async (projectId, taskId, taskData) => {
    const { title, description, priority, dueDate } = taskData;
    try {
      const response = await api.patch(`/task/${taskId}`, {
        title,
        description,
        priority,
        dueDate,
      });
      if (response.data?.data?.updatedTask) {
        const updated = mapTask(response.data.data.updatedTask);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = (proj.tasks || []).map((task) =>
                task.id === taskId ? { ...task, ...updated } : task,
              );
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (projectId, taskId) => {
    try {
      await api.delete(`/task/${taskId}`);
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id === projectId) {
            const updatedTasks = (proj.tasks || []).filter(
              (task) => task.id !== taskId,
            );
            return { ...proj, tasks: updatedTasks };
          }
          return proj;
        }),
      );
      fetchProjectById(projectId, false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleTaskStatus = async (projectId, taskId) => {
    try {
      const response = await api.patch(`/task/${taskId}/toggle-status`);
      if (response.data?.data) {
        const updated = mapTask(response.data.data);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = (proj.tasks || []).map((task) => {
                if (task.id === taskId) {
                  // Toggle subtasks to match if we completed task
                  const updatedSubtasks = (task.subtasks || []).map((sub) => ({
                    ...sub,
                    completed: updated.completed,
                  }));
                  return {
                    ...task,
                    completed: updated.completed,
                    subtasks: updatedSubtasks,
                  };
                }
                return task;
              });
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
      }
    } catch (error) {
      console.error("Failed to toggle task status:", error);
    }
  };

  const createSubTask = async (projectId, taskId, title) => {
    try {
      const response = await api.post(`/subTask/task/${taskId}`, { title });
      if (response.data?.data?.subTask) {
        const newSubTask = mapSubtask(response.data.data.subTask);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = (proj.tasks || []).map((task) => {
                if (task.id === taskId) {
                  const updatedSub = [...(task.subtasks || []), newSubTask];
                  return {
                    ...task,
                    completed: false,
                    subtasks: updatedSub,
                  };
                }
                return task;
              });
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
        return newSubTask;
      }
    } catch (error) {
      console.error("Failed to create subtask:", error);
    }
  };

  const updateSubTask = async (projectId, taskId, subTaskId, title) => {
    try {
      const response = await api.patch(`/subTask/${subTaskId}`, { title });
      if (response.data?.data?.updatedSubTask) {
        const updated = mapSubtask(response.data.data.updatedSubTask);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = (proj.tasks || []).map((task) => {
                if (task.id === taskId) {
                  const updatedSub = (task.subtasks || []).map((sub) =>
                    sub.id === subTaskId ? { ...sub, ...updated } : sub,
                  );
                  return { ...task, subtasks: updatedSub };
                }
                return task;
              });
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
      }
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  const deleteSubTask = async (projectId, taskId, subTaskId) => {
    try {
      await api.delete(`/subTask/${subTaskId}`);
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id === projectId) {
            const updatedTasks = (proj.tasks || []).map((task) => {
              if (task.id === taskId) {
                const updatedSub = (task.subtasks || []).filter(
                  (sub) => sub.id !== subTaskId,
                );
                const allCompleted =
                  updatedSub.length > 0 && updatedSub.every((s) => s.completed);
                return {
                  ...task,
                  completed: allCompleted,
                  subtasks: updatedSub,
                };
              }
              return task;
            });
            return { ...proj, tasks: updatedTasks };
          }
          return proj;
        }),
      );
      fetchProjectById(projectId, false);
    } catch (error) {
      console.error("Failed to delete subtask:", error);
    }
  };

  const toggleSubTaskStatus = async (projectId, taskId, subTaskId) => {
    try {
      const response = await api.patch(`/subTask/${subTaskId}/toggle-status`);
      if (response.data?.data) {
        const updated = mapSubtask(response.data.data);
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              const updatedTasks = (proj.tasks || []).map((task) => {
                if (task.id === taskId) {
                  const updatedSub = (task.subtasks || []).map((sub) =>
                    sub.id === subTaskId
                      ? { ...sub, completed: updated.completed }
                      : sub,
                  );
                  const allCompleted =
                    updatedSub.length > 0 &&
                    updatedSub.every((s) => s.completed);
                  return {
                    ...task,
                    completed: allCompleted,
                    subtasks: updatedSub,
                  };
                }
                return task;
              });
              return { ...proj, tasks: updatedTasks };
            }
            return proj;
          }),
        );
        fetchProjectById(projectId, false);
      }
    } catch (error) {
      console.error("Failed to toggle subtask status:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        isLoading,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        createSubTask,
        updateSubTask,
        deleteSubTask,
        toggleSubTaskStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

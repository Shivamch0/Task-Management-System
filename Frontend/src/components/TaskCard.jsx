import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Check,
  Plus,
  ListTodo,
  X,
} from "lucide-react";
import { SubTaskItem } from "./SubTaskItem";
import { ProgressBar } from "./ProgressBar";

export function TaskCard({
  task,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onCreateSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onToggleSubtask,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const taskProgress =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : task.completed
        ? 100
        : 0;

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const priorityStyles = {
    High: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50",
    Medium:
      "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50",
    Low: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50",
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onCreateSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
      setIsAddingSubtask(false);
      setIsExpanded(true);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium transition-all duration-300 ${
        task.completed ? "opacity-80" : ""
      }`}
    >
      <div className="p-5 flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggleTask(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-md border transition-colors flex items-center justify-center mt-1 ${
            task.completed
              ? "bg-indigo-600 border-indigo-600 text-white animate-fade-in"
              : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-transparent bg-white dark:bg-slate-800"
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${priorityStyles[task.priority] || priorityStyles.Medium}`}
              >
                {task.priority}
              </span>
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${isOverdue ? "text-red-650 dark:text-red-400 font-semibold" : "text-slate-400 dark:text-slate-500"}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {isOverdue && " (Overdue)"}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditTask(task)}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-450 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded transition-colors"
                title="Edit Task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h4
            className={`text-base font-bold font-display ${
              task.completed
                ? "text-slate-400 dark:text-slate-500 line-through"
                : "text-slate-800 dark:text-slate-100"
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${
                task.completed ? "line-through opacity-60" : ""
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-850">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-450 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <ListTodo className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>
                {totalSubtasks > 0
                  ? `${completedSubtasks}/${totalSubtasks} Subtasks`
                  : "No Subtasks"}
              </span>
            </button>

            {totalSubtasks > 0 && (
              <div className="flex items-center gap-2 w-32">
                <div className="flex-1">
                  <ProgressBar value={taskProgress} size="sm" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {taskProgress}%
                </span>
              </div>
            )}

            {totalSubtasks === 0 && (
              <button
                onClick={() => {
                  setIsAddingSubtask(true);
                  setIsExpanded(true);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-450 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 px-2 py-1 rounded transition-colors uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" /> Add Subtask
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 rounded-b-xl space-y-2.5 pt-3">
          {totalSubtasks > 0 && (
            <div className="space-y-1">
              {subtasks.map((sub) => (
                <SubTaskItem
                  key={sub.id}
                  subtask={sub}
                  onToggle={(subId) => onToggleSubtask(task.id, subId)}
                  onEdit={(subId, title) =>
                    onUpdateSubtask(task.id, subId, title)
                  }
                  onDelete={(subId) => onDeleteSubtask(task.id, subId)}
                />
              ))}
            </div>
          )}

          {isAddingSubtask || totalSubtasks > 0 ? (
            <form
              onSubmit={handleAddSubtask}
              className="flex items-center gap-2 mt-2 px-1"
            >
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100"
                autoFocus={isAddingSubtask}
              />
              <button
                type="submit"
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                title="Save Subtask"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {totalSubtasks > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(false)}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          ) : null}
        </div>
      )}
    </div>
  );
}

import {
  Edit2,
  Trash2,
  Check,
  Clock,
  CheckCircle,
} from "lucide-react";

export function TaskCard({
  task,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}) {
  const isCompleted = task.status === "completed" || task.completed;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium transition-all duration-300 hover:shadow-premium-hover flex items-start gap-4 p-5 ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onToggleTask(task.id)}
        className={`flex-shrink-0 w-5.5 h-5.5 rounded-lg border transition-all flex items-center justify-center mt-1 cursor-pointer ${
          isCompleted
            ? "bg-indigo-600 border-indigo-600 text-white animate-fade-in"
            : "border-slate-350 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-transparent bg-white dark:bg-slate-800"
        }`}
      >
        {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEditTask(task)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4
          className={`text-base font-bold font-display leading-tight truncate-2-lines transition-all ${
            isCompleted
              ? "text-slate-400 dark:text-slate-500 line-through font-medium"
              : "text-slate-800 dark:text-slate-105"
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p
            className={`text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed whitespace-pre-wrap ${
              isCompleted ? "line-through opacity-60" : ""
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}

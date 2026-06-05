import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../components/Button';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo,
  TrendingUp,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function StatsCard({ title, value, icon: Icon, iconColor, description, trend }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium flex items-center justify-between group hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-105 font-display">{value}</p>
          {trend && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
              {trend.text}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
      </div>
      <div className={`p-3 rounded-xl ${iconColor} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { 
    tasks, 
    isLoading, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus 
  } = useApp();
  const { currentUser } = useAuth();

  //! Search, filter and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  //! Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeEditTask, setActiveEditTask] = useState(null);

  //! Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //! Filter and Search Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isCompleted = task.status === "completed" || task.completed;
    const matchesFilter = 
      statusFilter === "all" ||
      (statusFilter === "completed" && isCompleted) ||
      (statusFilter === "pending" && !isCompleted);

    return matchesSearch && matchesFilter;
  });

  //! Pagination calculation
  const totalTasksCount = filteredTasks.length;
  const totalPages = Math.ceil(totalTasksCount / tasksPerPage) || 1;
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  useEffect(() => {
    fetchTasks(false);
  }, []);

  //! Reset page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  //! Adjust page if current page exceeds total pages (e.g. after task deletion)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  //! Handle open create modal
  const handleOpenCreate = () => {
    setTitle("");
    setDescription("");
    setFormError("");
    setIsCreateOpen(true);
  };

  //! Handle open edit modal
  const handleOpenEdit = (task) => {
    setActiveEditTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setFormError("");
    setIsEditOpen(true);
  };

  //! Handle Create Task Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Task title is required");
      return;
    }
    setFormError("");
    setIsSubmitting(true);
    const result = await createTask({
      title: title.trim(),
      description: description.trim(),
      status: "pending"
    });
    setIsSubmitting(false);
    if (result) {
      setIsCreateOpen(false);
    } else {
      setFormError("Failed to create task. Please try again.");
    }
  };

  //! Handle Edit Task Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Task title is required");
      return;
    }
    setFormError("");
    setIsSubmitting(true);
    const result = await updateTask(activeEditTask.id, {
      title: title.trim(),
      description: description.trim()
    });
    setIsSubmitting(false);
    if (result) {
      setIsEditOpen(false);
      setActiveEditTask(null);
    } else {
      setFormError("Failed to update task. Please try again.");
    }
  };

  //! Statistics calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed" || t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium animate-pulse flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-20 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-105 tracking-tight font-display">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Manage your daily tasks and review progress metrics.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:shadow-md cursor-pointer focus:outline-none self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          iconColor="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20"
          description="All registered tasks"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
          description="Awaiting action"
        />
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
          trend={{ type: 'increase', text: `${completionRate}% rate` }}
          description="Tasks accomplished"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          iconColor="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
          description="Efficiency metric"
        />
      </div>

      {/* Search, Filter and Tasks Board Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium p-6 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-50 dark:border-slate-850">
          
          {/* Status Filters */}
          <div className="flex p-1 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 self-start">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-650 dark:text-indigo-400"
                  : "text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-650 dark:text-indigo-400"
                  : "text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-650 dark:text-indigo-400"
                  : "text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by title or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-4">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleTask={toggleTaskStatus}
                onEditTask={handleOpenEdit}
                onDeleteTask={deleteTask}
              />
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <ListTodo className="w-10 h-10 text-slate-350 dark:text-slate-600" />
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No tasks found</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] mt-1">
                  Try adjusting your search criteria, switching filters, or create a brand new task.
                </p>
              </div>
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all cursor-pointer"
              >
                Create your first task
              </button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalTasksCount > tasksPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-slate-850">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{indexOfFirstTask + 1}</span> to{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {indexOfLastTask > totalTasksCount ? totalTasksCount : indexOfLastTask}
              </span>{" "}
              of <span className="font-bold text-slate-700 dark:text-slate-300">{totalTasksCount}</span> tasks
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8.5 h-8.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer ${
                      currentPage === pageNumber
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg shadow-2xl p-6 relative animate-fade-in space-y-4">
            
            <button 
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Create New Task</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500">Plan out a new activity in your workspace</p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Design UI layout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">Task Description (Optional)</label>
                <textarea
                  placeholder="Provide task notes or breakdown..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg shadow-2xl p-6 relative animate-fade-in space-y-4">
            
            <button 
              onClick={() => {
                setIsEditOpen(false);
                setActiveEditTask(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Edit Task Details</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500">Update task records in the cloud</p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider">Task Description (Optional)</label>
                <textarea
                  placeholder="Task details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    setIsEditOpen(false);
                    setActiveEditTask(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
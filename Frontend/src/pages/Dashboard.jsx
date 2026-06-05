import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatsCard } from '../components/StatsCard';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  ListTodo,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { projects, isLoading, toggleTaskStatus } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Welcome header skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>

        {/* Stats card skeleton grid */}
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

        {/* Dashboard contents split grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chart container skeleton */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium animate-pulse h-64 flex flex-col justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="flex gap-4 items-end h-40">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg h-[60%]" style={{ height: `${[40, 65, 50, 80, 95, 30, 45][idx]}%` }} />
                ))}
              </div>
            </div>

            {/* Recent Tasks list skeleton */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalProjects = projects.length;
  
  // Flatten all tasks
  const allTasks = projects.reduce((acc, proj) => {
    const tasksWithProjInfo = (proj.tasks || []).map(t => ({
      ...t,
      projectId: proj.id,
      projectName: proj.title
    }));
    return acc.concat(tasksWithProjInfo);
  }, []);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Recent Projects (last 3 created)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Recent Tasks (last 5 created/modified tasks)
  const recentTasks = [...allTasks].slice(0, 5);

  // Productivity calculation
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority indicator styles
  const priorityColors = {
    High: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50',
    Medium: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50',
    Low: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50'
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Shivam'}!
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Here's what's happening with your workspace today.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/projects?create=true')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          iconColor="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20"
          description="Active workspaces"
        />
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          iconColor="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
          description="In all projects"
        />
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
          trend={{ type: 'increase', text: `${completionRate}% rate` }}
          description="overall completion"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
          description="Require attention"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Productivity & Recent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Productivity Overview (Simulated Chart) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">Productivity Overview</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Weekly task completion analytics</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% vs last week</span>
              </div>
            </div>

            {/* Simulated Chart Bars */}
            <div className="grid grid-cols-7 gap-4 h-48 items-end pt-4 px-2">
              {[
                { day: 'Mon', value: 40, completed: 4 },
                { day: 'Tue', value: 65, completed: 6 },
                { day: 'Wed', value: 50, completed: 5 },
                { day: 'Thu', value: 80, completed: 8 },
                { day: 'Fri', value: 95, completed: 10 },
                { day: 'Sat', value: 30, completed: 3 },
                { day: 'Sun', value: 45, completed: 4 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 dark:bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow-sm mb-1 pointer-events-none text-center">
                    <p className="font-bold">{item.completed} Tasks</p>
                    <p className="text-slate-350 dark:text-slate-400">{item.value}% Rate</p>
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-full max-h-[80%] flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-indigo-500 rounded-lg group-hover:bg-indigo-600 transition-all duration-500" 
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">Recent Tasks</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Quick view of tasks from your projects</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/projects')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-450 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider"
              >
                All Projects <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentTasks.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-850">
                {recentTasks.map((task) => (
                  <div key={task.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.projectId, task.id)}
                        className={`flex-shrink-0 w-4.5 h-4.5 rounded border transition-colors flex items-center justify-center ${
                          task.completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-transparent bg-white dark:bg-slate-850'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <p 
                          onClick={() => navigate(`/dashboard/projects/${task.projectId}`)}
                          className={`text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-450 cursor-pointer transition-colors truncate ${
                            task.completed ? 'text-slate-405 dark:text-slate-500 line-through' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          Project: <span className="font-semibold text-slate-550 dark:text-slate-400">{task.projectName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider ${
                        priorityColors[task.priority] || priorityColors.Medium
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No tasks available. Create a project to start planning!
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Recent Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">Recent Projects</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Your latest work activities</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-455 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((proj) => (
                <div key={proj.id} className="relative">
                  {/* Simplified Card or Full ProjectCard */}
                  <div 
                    onClick={() => navigate(`/dashboard/projects/${proj.id}`)}
                    className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium hover:shadow-premium-hover cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display group-hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                        {proj.title}
                      </h4>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                        {proj.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {proj.description || "No description provided."}
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          proj.progress === 100 
                            ? 'bg-emerald-500' 
                            : proj.progress > 50 
                            ? 'bg-indigo-500' 
                            : 'bg-amber-500'
                        }`} 
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-sm">
                No projects found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
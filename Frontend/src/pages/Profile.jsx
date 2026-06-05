import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { 
  Sparkles, 
  FolderKanban, 
  CheckCircle2, 
  Award,
  RefreshCw
} from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { projects } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Statistics calculation
  const totalProjects = projects.length;
  const allTasks = projects.reduce((acc, proj) => acc.concat(proj.tasks || []), []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Formik form setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      avatar: currentUser?.avatar || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Display Name is required'),
      avatar: Yup.string()
        .url('Must be a valid URL')
        .optional()
        .nullable(),
    }),
    onSubmit: async (values) => {
      const res = await updateProfile(values.name.trim(), values.avatar.trim());
      if (res.success) {
        setIsEditing(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    },
  });

  const handleRegenerateAvatar = async () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    
    await formik.setFieldValue('avatar', newAvatar);
    if (!isEditing) {
      // If not in editing mode, update immediately in the backend
      await updateProfile(formik.values.name || currentUser?.name, newAvatar);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
          User Profile
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-550 font-medium">
          Manage your personal account settings, avatars, and review workspace activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Edit Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col items-center text-center">
            {/* Avatar display */}
            <div className="relative group mb-4">
              <img 
                src={formik.values.avatar || 'https://api.dicebear.com/7.x/adventurer/svg'} 
                alt={currentUser?.name} 
                className="w-28 h-28 rounded-full border-2 border-indigo-500 bg-slate-50 dark:bg-slate-800 object-cover shadow-sm p-1 transition-all duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={handleRegenerateAvatar}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
                title="Regenerate Avatar Seed"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
              {currentUser?.name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-550 font-medium mb-6">
              {currentUser?.email}
            </p>

            {isSaved && (
              <div className="mb-4 w-full p-2 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg animate-fade-in">
                Profile updated successfully!
              </div>
            )}

            {isEditing ? (
              <form onSubmit={formik.handleSubmit} className="w-full space-y-4 text-left">
                <Input
                  label="Display Name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />
                <Input
                  label="Avatar Image URL"
                  type="text"
                  name="avatar"
                  value={formik.values.avatar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.avatar && formik.errors.avatar}
                  placeholder="https://example.com/avatar.jpg"
                />
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" type="button" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full">
                Edit Profile Details
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" /> Workspace Analytics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Projects */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Projects</p>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-display">{totalProjects}</p>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed Tasks</p>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-display">{completedTasks}</p>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completion Rate</p>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-display">{completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Micro Details list */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wider">Account Metrics Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between p-3 bg-slate-50/50 dark:bg-slate-850/50 rounded-lg border border-slate-55 dark:border-slate-800">
                  <span>Total Tasks:</span>
                  <span className="text-slate-800 dark:text-slate-205 font-bold">{totalTasks}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50/50 dark:bg-slate-850/50 rounded-lg border border-slate-55 dark:border-slate-800">
                  <span>Pending Tasks:</span>
                  <span className="text-slate-800 dark:text-slate-205 font-bold">{pendingTasks}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50/50 dark:bg-slate-850/50 rounded-lg border border-slate-55 dark:border-slate-800">
                  <span>Registered Account Email:</span>
                  <span className="text-slate-800 dark:text-slate-205 font-bold truncate max-w-[200px]" title={currentUser?.email}>{currentUser?.email}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50/50 dark:bg-slate-850/50 rounded-lg border border-slate-55 dark:border-slate-800">
                  <span>Account Level Badge:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider">
                    {completionRate > 80 ? 'Master Planner' : completionRate > 50 ? 'Workspace Expert' : 'Regular User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
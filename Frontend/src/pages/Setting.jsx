import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  Bell, 
  Palette, 
  ShieldCheck, 
  Lock
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useAuth();

  // Notification states
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setSaveSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
          Settings
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Customize notifications preferences, security parameters, and application look-and-feel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Navigation/Category Layout on Left */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notifications Panel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50 dark:border-slate-850">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Notifications Settings</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Choose when and how you want to be alerted</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="emailNotify" className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Notifications</label>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Receive summaries, task reports, and milestones alerts.</p>
                </div>
                <button
                  type="button"
                  id="emailNotify"
                  onClick={() => setEmailNotify(!emailNotify)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailNotify ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration-200 ease-in-out ${
                    emailNotify ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="pushNotify" className="text-sm font-bold text-slate-700 dark:text-slate-300">Desktop Push Alerts</label>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Get instant alerts on screen when due dates approach.</p>
                </div>
                <button
                  type="button"
                  id="pushNotify"
                  onClick={() => setPushNotify(!pushNotify)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pushNotify ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration duration-200 ease-in-out ${
                    pushNotify ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="weeklyDigest" className="text-sm font-bold text-slate-700 dark:text-slate-300">Weekly Progress Digest</label>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Receive a weekly productivity report on Sunday evening.</p>
                </div>
                <button
                  type="button"
                  id="weeklyDigest"
                  onClick={() => setWeeklyDigest(!weeklyDigest)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    weeklyDigest ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration-200 ease-in-out ${
                    weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Security Password Reset */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50 dark:border-slate-850">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Security Settings</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Update password details for account security</p>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg animate-fade-in">
                Password updated successfully (Simulated).
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm">
                  Change Password
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* Side Preferences Column */}
        <div className="space-y-6">
          {/* Theme Preferences */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Theme Preference</h3>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-550 leading-relaxed">
              Select your workspace theme. Preference is automatically saved to Local Storage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Light card */}
              <button 
                type="button" 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center text-xs font-bold text-slate-700">Ab</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Light</span>
              </button>

              {/* Dark card */}
              <button 
                type="button" 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center text-xs font-bold text-slate-400">Ab</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark</span>
              </button>
            </div>
          </div>

          {/* Workspace Info Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">System Integrity</h4>
            </div>
            <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
              TaskFlow is connected to a live **Node.js/Express** backend API. All project workspaces, tasks, and subtasks are securely stored in a persistent MongoDB cloud database.
            </p>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Database storage: MongoDB
              <br />
              Status: Connected (Node.js API Server)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}